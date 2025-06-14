import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Admin sayfalarına sadece admin kullanıcılar erişebilir
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (req.nextauth.token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Korumalı rotalar
        const protectedPaths = ['/dashboard', '/profile', '/messages', '/admin']
        
        if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*', 
    '/messages/:path*',
    '/admin/:path*'
  ]
} 