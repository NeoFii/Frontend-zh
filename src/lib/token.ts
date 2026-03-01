/**
 * Token 管理模块
 * 双 Token 方案：Access Token 存内存，Refresh Token 存 localStorage
 */

// Token 存储键名
const REFRESH_TOKEN_KEY = 'refresh_token'
const TOKEN_EXPIRY_KEY = 'token_expiry'

// Access Token 存内存（不持久化，页面关闭即失效）
let accessToken: string | null = null

/**
 * 获取 Access Token（从内存）
 */
export function getAccessToken(): string | null {
  return accessToken
}

/**
 * 设置 Access Token（存内存 + sessionStorage 存过期时间）
 * @param token Access Token 字符串
 * @param expiresIn 过期时间（秒）
 */
export function setAccessToken(token: string, expiresIn: number): void {
  accessToken = token
  // 记录过期时间（提前 30 秒标记为过期，留出刷新时间）
  const expiryTime = Date.now() + (expiresIn - 30) * 1000
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, String(expiryTime))
  }
}

/**
 * 清除 Access Token
 */
export function removeAccessToken(): void {
  accessToken = null
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY)
  }
}

/**
 * 检查 Access Token 是否即将过期（提前 30 秒）
 */
export function isAccessTokenExpiringSoon(): boolean {
  if (typeof window === 'undefined') return true
  const expiryStr = sessionStorage.getItem(TOKEN_EXPIRY_KEY)
  if (!expiryStr) return true
  const expiryTime = parseInt(expiryStr, 10)
  return Date.now() >= expiryTime
}

/**
 * 获取 Refresh Token（从 localStorage）
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * 设置 Refresh Token（存 localStorage）
 */
export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

/**
 * 清除 Refresh Token
 */
export function removeRefreshToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * 清除所有 Token（登录/登出时调用）
 */
export function clearAllTokens(): void {
  removeAccessToken()
  removeRefreshToken()
}

/**
 * 检查是否存在有效的 Refresh Token
 */
export function hasRefreshToken(): boolean {
  return !!getRefreshToken()
}
