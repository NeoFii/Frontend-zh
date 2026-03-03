import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)
const protectedPaths = ['/console']
const AUTH_COOKIE_NAME = 'access_token'
const LOCALE_COOKIE_NAME = 'preferred-locale'

/**
 * 从 Cookie 获取用户偏好的语言
 */
function getLocaleFromCookie(request: NextRequest): string | null {
  const localeCookie = request.cookies.get(LOCALE_COOKIE_NAME)
  if (localeCookie?.value && routing.locales.includes(localeCookie.value as typeof routing.locales[number])) {
    return localeCookie.value
  }
  return null
}

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

  // 从 Cookie 获取用户偏好的语言
  const userLocale = getLocaleFromCookie(request) || routing.defaultLocale

  // 移除路径中的 locale 前缀（如果存在）
  const pathnameWithoutLocale = pathname.replace(/^\/(zh|en)/, '') || '/'
  const isProtectedPath = protectedPaths.some((p) => pathnameWithoutLocale.startsWith(p))
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)
  const hasValidAuthCookie = authCookie && authCookie.value.trim().length > 0

  // 已登录用户访问登录页，重定向到控制台
  if (pathnameWithoutLocale === '/login' && hasValidAuthCookie) {
    const redirectUrl = userLocale === routing.defaultLocale
      ? '/console/usage/record'
      : `/${userLocale}/console/usage/record`
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // 未登录用户访问受保护路径，重定向到登录页
  if (isProtectedPath && !hasValidAuthCookie) {
    const loginPath = userLocale === routing.defaultLocale
      ? '/login'
      : `/${userLocale}/login`
    const loginUrl = new URL(loginPath, request.url)
    loginUrl.searchParams.set('redirect', pathnameWithoutLocale)
    return NextResponse.redirect(loginUrl)
  }

  // 调用 i18n middleware 处理 locale 路由
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)']
}
