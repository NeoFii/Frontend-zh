import { setAccessToken } from '@/lib/token'
import { http } from './index'

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  email: string
  verification_code: string
  password: string
  confirm_password: string
  lang?: string
}

export interface User {
  uid: string
  email: string
}

// 完整的用户信息（包含状态和时间戳）
export interface UserInfo {
  uid: string
  email: string
  status: number
  email_verified_at: string | null
  last_login_at: string | null
  created_at: string
  /** 用户级 RPM 上限。null 表示未单独设置，使用 default_rpm。 */
  rpm_limit?: number | null
  /** 未单独设置时使用的全局默认 RPM。 */
  default_rpm?: number
  /** 最近 60 秒滚动窗口内消耗的 token 数（实时 TPM）。 */
  current_tpm?: number
}

export interface AuthSessionData {
  access_token: string
  expires_in: number
}

export interface LoginResponse {
  code: number
  message: string
  data: {
    user: UserInfo
  } & AuthSessionData
}

export interface RefreshResponse {
  code: number
  message: string
  data: AuthSessionData
}

export interface RegisterResponse {
  code: number
  message: string
  data: {
    uid: string
    email: string
    created_at: string
    access_token?: string
    expires_in?: number
  }
}

export interface SendCodeResponse {
  code: number
  message: string
}

/**
 * 用户登录
 */
export function login(params: LoginParams): Promise<LoginResponse> {
  return http.post('/auth/login', params)
}

/**
 * 用户注册
 */
export function register(params: RegisterParams): Promise<RegisterResponse> {
  return http.post('/auth/register', params)
}

/**
 * 发送验证码
 */
export function sendVerificationCode(email: string): Promise<SendCodeResponse> {
  return http.post('/auth/send-email-code', { email, purpose: 'register' })
}

export interface LogoutResponse {
  code: number
  message: string
}

export interface UserInfoResponse {
  code: number
  message: string
  data: UserInfo
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser(): Promise<UserInfoResponse> {
  return http.get('/auth/me')
}

/**
 * Refresh the current session using the httpOnly refresh cookie.
 */
export function refreshSession(): Promise<RefreshResponse> {
  return http.post<RefreshResponse>('/auth/refresh').then((response) => {
    setAccessToken(response.data.access_token, response.data.expires_in)
    return response
  })
}

/**
 * 退出登录
 */
export function logout(): Promise<LogoutResponse> {
  return http.post('/auth/logout')
}

/**
 * 登录专用发送验证码
 */
export function sendLoginCode(email: string): Promise<SendCodeResponse> {
  return http.post('/auth/send-email-code', { email, purpose: 'login' })
}

/**
 * 邮箱验证码登录
 */
export interface LoginWithCodeParams {
  email: string
  code: string
}

export function loginWithCode(params: LoginWithCodeParams): Promise<LoginResponse> {
  return http.post('/auth/login-with-code', params)
}

/**
 * 忘记密码发送验证码
 */
export function sendResetPasswordCode(email: string): Promise<SendCodeResponse> {
  return http.post('/auth/send-email-code', { email, purpose: 'reset_password' })
}

/**
 * 重置密码
 */
export interface ResetPasswordParams {
  email: string
  code: string
  new_password: string
}

export interface ResetPasswordResponse {
  code: number
  message: string
}

export function resetPassword(params: ResetPasswordParams): Promise<ResetPasswordResponse> {
  return http.post('/auth/reset-password', params)
}

export interface ChangePasswordParams {
  old_password: string
  new_password: string
  lang?: string
}

export interface ChangePasswordResponse {
  code: number
  message: string
}

export function changePassword(params: ChangePasswordParams): Promise<ChangePasswordResponse> {
  return http.post('/auth/change-password', params)
}

/**
 * 发送邮箱验证码（用于邮箱验证）
 */
export function sendVerifyEmailCode(email: string): Promise<SendCodeResponse> {
  return http.post('/auth/send-email-code', { email, purpose: 'verify' })
}

/**
 * 验证邮箱
 */
export interface VerifyEmailParams {
  email: string
  code: string
}

export interface VerifyEmailResponse {
  code: number
  message: string
}

export function verifyEmail(params: VerifyEmailParams): Promise<VerifyEmailResponse> {
  return http.post('/auth/verify-email', params)
}
