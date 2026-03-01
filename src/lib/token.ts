/**
 * Token 管理模块
 * 双 Token 方案：Access Token 存内存，Refresh Token 由 httpOnly Cookie 管理
 * 认证状态通过调用 /auth/me 验证，不再依赖 localStorage
 */

// Access Token 存内存（不持久化，页面关闭即失效）
let accessToken: string | null = null

// 过期时间存内存变量（避免 XSS 读取）
let tokenExpiry: number | null = null

/**
 * 获取 Access Token（从内存）
 */
export function getAccessToken(): string | null {
  return accessToken
}

/**
 * 设置 Access Token（存内存）
 * @param token Access Token 字符串
 * @param expiresIn 过期时间（秒）
 */
export function setAccessToken(token: string, expiresIn: number): void {
  accessToken = token
  // 提前 30 秒判定过期，避免边界条件
  tokenExpiry = Date.now() + (expiresIn - 30) * 1000
}

/**
 * 清除 Access Token
 */
export function removeAccessToken(): void {
  accessToken = null
  tokenExpiry = null
}

/**
 * 检查 Access Token 是否即将过期（提前 30 秒）
 */
export function isAccessTokenExpiringSoon(): boolean {
  if (!tokenExpiry) return true
  return Date.now() >= tokenExpiry
}

/**
 * 检查 Token 是否已过期
 */
export function isTokenExpired(): boolean {
  if (!tokenExpiry) return true
  return Date.now() >= tokenExpiry
}

/**
 * 清除所有 Token（登录/登出时调用）
 * 注意：Refresh Token 存储在 httpOnly Cookie 中，由后端管理清除
 * 前端只需清除 Access Token 内存变量
 */
export function clearAllTokens(): void {
  removeAccessToken()
}

/**
 * 兼容导出（已废弃，保留用于避免运行时错误）
 * @deprecated 请使用 setAccessToken / getAccessToken / clearAllTokens
 */
export const clearAccessToken = removeAccessToken
