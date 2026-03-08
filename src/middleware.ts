import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/console']
const AUTH_COOKIE_NAME = 'access_token'

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 跳过静态资源和 API 路由
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 移除路径中的 locale 前缀（如果存在）
  const pathnameWithoutLocale = pathname.replace(/^\/(zh|en)/, '') || '/'
  const isProtectedPath = protectedPaths.some((p) => pathnameWithoutLocale.startsWith(p))
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)
  const hasValidAuthCookie = authCookie && authCookie.value.trim().length > 0

  // 已登录用户访问登录页，重定向到控制台
  if (pathnameWithoutLocale === '/login' && hasValidAuthCookie) {
    return NextResponse.redirect(new URL('/console/usage/record', request.url))
  }

  // 未登录用户访问受保护路径，重定向到登录页
  if (isProtectedPath && !hasValidAuthCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathnameWithoutLocale)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)']
}
