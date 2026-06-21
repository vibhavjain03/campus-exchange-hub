import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken } from './lib/auth'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define protected routes
  const isProtected =
    pathname.startsWith('/profile') ||
    pathname.startsWith('/listings/create') ||
    pathname.startsWith('/listings/edit')

  if (isProtected) {
    const token = request.cookies.get('session_token')?.value
    const session = token ? verifySessionToken(token) : null

    if (!session) {
      // Redirect to login page
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Define the configuration matcher to apply to protected paths
export const config = {
  matcher: [
    '/profile',
    '/profile/:path*',
    '/listings/create',
    '/listings/edit/:path*'
  ]
}
