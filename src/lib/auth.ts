import { cookies } from 'next/headers'
import crypto from 'crypto'
import db from './db'

const SESSION_COOKIE_NAME = 'session_token'
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only-12345'

export interface SessionPayload {
  userId: string
  email: string
  name: string
  expiresAt: number
}

// Simple signature generator
function signToken(payload: string): string {
  return crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url')
}

// Create secure session token
export function createSessionToken(payload: Omit<SessionPayload, 'expiresAt'>): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  const data = JSON.stringify({ ...payload, expiresAt })
  const signature = signToken(data)
  return `${data}.${signature}`
}

// Verify token
export function verifySessionToken(token: string): Omit<SessionPayload, 'expiresAt'> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const [dataStr, signature] = parts
    const expectedSignature = signToken(dataStr)
    if (signature !== expectedSignature) return null

    const data = JSON.parse(dataStr) as SessionPayload
    if (Date.now() > data.expiresAt) return null // Expired

    return {
      userId: data.userId,
      email: data.email,
      name: data.name
    }
  } catch {
    return null
  }
}

// Get active session
export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}

// Get full profile of active user
export async function getSessionProfile() {
  const session = await getSession()
  if (!session) return null
  return db.profile.findUnique({
    where: { id: session.userId }
  })
}

// Set session cookie
export async function setSessionCookie(userId: string, email: string, name: string) {
  const token = createSessionToken({ userId, email, name })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  })
}

// Delete session cookie
export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0 // Expired
  })
}

// Password hashing utility using scrypt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

// Password verification utility
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(':')
    if (!salt || !hash) return false
    const verifyHash = crypto.scryptSync(password, salt, 64).toString('hex')
    return hash === verifyHash
  } catch {
    return false
  }
}
