import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isLogin = pathname === '/admin/login'
  const admin = req.cookies.get('admin')?.value === '1'

  // Protect admin pages
  if (!admin && pathname.startsWith('/admin') && !isLogin) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // Allow seeing login page even if authed (avoid auto-redirect)

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}


