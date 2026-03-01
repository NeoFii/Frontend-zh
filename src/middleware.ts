import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 受保护的路由路径
const protectedPaths = ['/console']

// 不需要认证的路径
const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
]

// 与后端 Set-Cookie key 保持一致
// TODO: 确认后端实际设置的 cookie 名称
const AUTH_COOKIE_NAME = 'access_token'

/**
 * Next.js Middleware - 服务端路由保护
 *
 * 在请求到达页面之前进行权限检查，提供更好的安全性和用户体验
 * 注意：此 middleware 依赖后端设置的认证 cookie
 * 注意：Middleware 只能检查 Cookie 是否存在，无法验证签名（签名验证在后端 API 层）
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 检查是否为受保护路径
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  // 检查是否为公开路径
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path))

  // 如果不是受保护路径，直接放行
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // 检查认证状态
  // 只接受后端实际设置的 Cookie 名称
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)
  // 验证 Cookie 存在且值非空（防止 key 存在但 value 为空的边界情况）
  const hasValidAuthCookie = authCookie && authCookie.value.trim().length > 0

  // 检查是否是公开路径（已登录用户访问登录页等）
  if (isPublicPath && hasValidAuthCookie) {
    // 已登录用户访问公开路径，重定向到控制台
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/console/usage/record', request.url))
    }
  }

  // 未认证用户访问受保护路径，重定向到登录页
  if (!hasValidAuthCookie) {
    const loginUrl = new URL('/login', request.url)
    // 保存原始路径，登录后可重定向回来
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

/**
 * 配置 middleware 匹配的路由
 * 只匹配受保护路径和公开路径，减少不必要的执行
 */
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api 路由 (/api/*)
     * - 静态文件
     * - _next 内部路径
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
}
