"use server";

import db from '@/lib/db'
import { setSessionCookie, clearSessionCookie, hashPassword, verifyPassword, getSession } from '@/lib/auth'
import { SignUpSchema, SignInSchema, UpdateProfileSchema } from '@/lib/validations/auth'
import { revalidatePath } from 'next/cache'

export interface ActionState {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

export async function signUpAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  try {
    const rawData = Object.fromEntries(formData.entries())
    const validation = SignUpSchema.safeParse(rawData)
    
    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors
      }
    }

    const { email, name, password, whatsappNumber } = validation.data

    // Check if user exists
    const existing = await db.profile.findUnique({ where: { email } })
    if (existing) {
      return {
        success: false,
        message: 'A user with this email address already exists.'
      }
    }

    // Create profile
    const passwordHash = hashPassword(password)
    const profile = await db.profile.create({
      data: {
        email,
        name,
        passwordHash,
        whatsappNumber,
      }
    })

    // Set cookie
    await setSessionCookie(profile.id, profile.email, profile.name)

    return { success: true }
  } catch (error) {
    console.error('Sign up error:', error)
    return {
      success: false,
      message: 'An error occurred during registration. Please try again.'
    }
  }
}

export async function signInAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  try {
    const rawData = Object.fromEntries(formData.entries())
    const validation = SignInSchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors
      }
    }

    const { email, password } = validation.data

    // Check profile
    const profile = await db.profile.findUnique({ where: { email } })
    if (!profile || !verifyPassword(password, profile.passwordHash)) {
      return {
        success: false,
        message: 'Invalid email or password.'
      }
    }

    // Set cookie
    await setSessionCookie(profile.id, profile.email, profile.name)

    return { success: true }
  } catch (error) {
    console.error('Sign in error:', error)
    return {
      success: false,
      message: 'An error occurred during sign in. Please try again.'
    }
  }
}

export async function signOutAction(): Promise<void> {
  await clearSessionCookie()
  revalidatePath('/')
}

export async function updateProfileAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, message: 'Unauthorized' }
    }

    const rawData = Object.fromEntries(formData.entries())
    const validation = UpdateProfileSchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors
      }
    }

    const { name, whatsappNumber, bio } = validation.data

    await db.profile.update({
      where: { id: session.userId },
      data: {
        name,
        whatsappNumber: whatsappNumber || null,
        bio: bio || null
      }
    })

    revalidatePath('/profile')
    return { success: true, message: 'Profile updated successfully.' }
  } catch (error) {
    console.error('Update profile error:', error)
    return {
      success: false,
      message: 'An error occurred while updating your profile.'
    }
  }
}
