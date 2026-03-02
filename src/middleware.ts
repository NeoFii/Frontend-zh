import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)
const protectedPaths = ['/console']
const AUTH_COOKIE_NAME = 'access_token'

/**
 * 解析 Accept-Language 头，返回最佳匹配语言
 * 优先级: zh-CN > zh > en
 */
function getLocaleFromAcceptLanguage(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null

  // 解析 Accept-Language 头
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, quality] = lang.trim().split(';q=')
      return {
        locale: locale?.toLowerCase().split('-')[0] || '',
        quality: quality ? parseFloat(quality) : 1.0,
      }
    })
    .filter((lang) => lang.locale)
    .sort((a, b) => b.quality - a.quality)

  // 匹配支持的语言
  for (const lang of languages) {
    if (lang.locale.startsWith('zh')) {
      return 'zh'
    }
    if (lang.locale.startsWith('en')) {
      return 'en'
    }
  }

  return null
}

/**
 * 判断路径是否已包含 locale
 */
function hasLocale(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  return Boolean(firstSegment) && (firstSegment === 'en' || firstSegment === 'zh')
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

  const pathnameWithoutLocale = pathname.replace(/^\/(zh|en)/, '') || '/'
  const isProtectedPath = protectedPaths.some((p) => pathnameWithoutLocale.startsWith(p))
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)
  const hasValidAuthCookie = authCookie && authCookie.value.trim().length > 0

  // 已登录用户访问登录页，重定向到控制台
  if (pathnameWithoutLocale === '/login' && hasValidAuthCookie) {
    const userLocale = pathname.split('/')[1] || routing.defaultLocale
    return NextResponse.redirect(new URL(`/${userLocale}/console/usage/record`, request.url))
  }

  // 未登录用户访问受保护路径，重定向到登录页
  if (isProtectedPath && !hasValidAuthCookie) {
    const userLocale = pathname.split('/')[1] || routing.defaultLocale
    const loginUrl = new URL(`/${userLocale}/login`, request.url)
    loginUrl.searchParams.set('redirect', pathnameWithoutLocale)
    return NextResponse.redirect(loginUrl)
  }

  // 如果路径已经包含 locale，直接调用 i18n middleware
  if (hasLocale(pathname)) {
    return intlMiddleware(request)
  }

  // 从 Accept-Language 获取用户偏好语言
  const acceptLanguage = request.headers.get('Accept-Language')
  const preferredLocale = getLocaleFromAcceptLanguage(acceptLanguage)

  // 根据用户偏好重定向到对应语言路径
  if (preferredLocale && preferredLocale !== routing.defaultLocale) {
    const newPath = `/${preferredLocale}${pathname}`
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  // 调用 i18n middleware 处理 locale 路由（使用默认语言）
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)']
}
