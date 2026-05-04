import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/console']
// Cookie names are namespaced (`user_*`) so the user and admin front-ends can
// coexist on the same domain. Must match `_set_auth_cookies` in
// services/user-service/src/controllers/auth.py.
const ACCESS_COOKIE_NAME = 'user_access_token'
const REFRESH_COOKIE_NAME = 'user_refresh_token'

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/router-api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const pathnameWithoutLocale = pathname.replace(/^\/(zh|en)/, '') || '/'
  const isProtectedPath = protectedPaths.some((item) => pathnameWithoutLocale.startsWith(item))
  const accessCookie = request.cookies.get(ACCESS_COOKIE_NAME)
  const refreshCookie = request.cookies.get(REFRESH_COOKIE_NAME)
  const hasSessionCookie = Boolean(accessCookie?.value.trim() || refreshCookie?.value.trim())

  if (isProtectedPath && !hasSessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathnameWithoutLocale)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|router-api|_next/static|_next/image|favicon.ico|.*\\..*$).*)'],
}
