import React from 'react'
import { redirect } from 'next/navigation'
import { getSessionProfile, clearSessionCookie } from '@/lib/auth'
import ProfileClient from './ProfileClient'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const profile = await getSessionProfile()

  if (!profile) {
    // If no session or profile is invalid, clear the session cookie and redirect
    await clearSessionCookie()
    redirect('/login')
  }

  // Sanitize profile object for the Client Component (Prisma types may contain non-serializable fields)
  const sanitizedProfile = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    whatsappNumber: profile.whatsappNumber,
    bio: profile.bio,
  }

  return <ProfileClient profile={sanitizedProfile} />
}
