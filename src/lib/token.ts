/**
 * Token 管理模块
 * 双 Token 方案：Access Token 存内存，Refresh Token 由 httpOnly Cookie 管理
 * 认证状态通过调用 /auth/me 验证，不再依赖 localStorage
 * 注意：Cookie 由后端通过 Set-Cookie 响应头管理，前端不直接操作
 */

// Access Token 存内存（不持久化，页面关闭即失效）
let accessToken: string | null = null

// 过期时间存内存变量（避免 XSS 读取）
let tokenExpiry: number | null = null
const EXPIRY_BUFFER_MS = 30 * 1000

export function getTokenExpiryTimestamp(expiresIn: number, now = Date.now()): number {
  return now + Math.max(expiresIn * 1000 - EXPIRY_BUFFER_MS, 0)
}

export function isTokenExpiringSoonAt(expiry: number | null, now = Date.now()): boolean {
  if (!expiry) return true
  return now >= expiry
}

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
  tokenExpiry = getTokenExpiryTimestamp(expiresIn)
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
  return isTokenExpiringSoonAt(tokenExpiry)
}

/**
 * 清除所有 Token（登录/登出时调用）
 * 注意：Refresh Token 存储在 httpOnly Cookie 中，由后端管理清除
 * Access Token 仅存内存，由前端清除
 */
export function clearAllTokens(): void {
  removeAccessToken()
}
