import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE = 'admin_session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const needsAdminSession =
    (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) ||
    pathname.startsWith('/api/admin/')

  if (needsAdminSession) {
    const session = request.cookies.get(ADMIN_COOKIE)?.value
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      if (pathname.startsWith('/api/admin/')) {
        return NextResponse.json({ error: '관리자 인증이 필요합니다.' }, { status: 401 })
      }

      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
