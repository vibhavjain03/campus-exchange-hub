import { z } from 'zod'

// WhatsApp regex format check: allows leading +, followed by 7 to 15 digits
export const whatsappRegex = /^\+?[1-9]\d{6,14}$/

export const SignUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be under 50 characters'),
  email: z.string().email('Invalid email address').refine((email) => {
    const allowed = process.env.ALLOWED_EMAIL_DOMAINS?.split(',') || ['college.edu']
    return allowed.some((domain) => email.endsWith(`@${domain.trim()}`))
  }, {
    message: `Registration is restricted to college email domains only (e.g., @college.edu)`
  }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  whatsappNumber: z.string()
    .min(10, 'WhatsApp number must be at least 10 characters')
    .regex(whatsappRegex, 'Invalid WhatsApp format. Use international format (e.g. +919876543210 or 919876543210)')
})

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be under 50 characters'),
  whatsappNumber: z.string()
    .min(10, 'WhatsApp number must be at least 10 characters')
    .regex(whatsappRegex, 'Invalid WhatsApp format. Use international format (e.g. +919876543210)')
    .optional()
    .or(z.literal('')),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional().or(z.literal(''))
})

export type SignUpInput = z.infer<typeof SignUpSchema>
export type SignInInput = z.infer<typeof SignInSchema>
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
