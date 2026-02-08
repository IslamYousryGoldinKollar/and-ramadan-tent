import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = (token as any)?.role === 'ADMIN'
    const pathname = req.nextUrl.pathname

    // Public routes - allow access without authentication
    const publicRoutes = ['/riddles', '/wellness', '/tent-registration']
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    if (isPublicRoute) {
      return NextResponse.next()
    }

    // Admin routes - require admin role
    if (pathname.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return NextResponse.next()
    }

    // Dashboard routes - require authentication
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public routes without token
        const pathname = req.nextUrl.pathname
        const publicRoutes = ['/riddles', '/wellness', '/tent-registration']
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true
        }
        // Require token for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/riddles/:path*',
    '/wellness/:path*',
    '/tent-registration/:path*',
  ],
}
