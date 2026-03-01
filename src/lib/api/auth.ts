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
}

export interface User {
  uid: number
  email: string
  nickname: string | null
  avatar_url: string | null
}

// 完整的用户信息（包含状态和时间戳）
export interface UserInfo {
  uid: number
  email: string
  nickname: string | null
  avatar_url: string | null
  status: number
  email_verified_at: string | null
  last_login_at: string | null
  created_at: string
}

export interface LoginResponse {
  code: number
  message: string
  data: {
    user: UserInfo
    access_token: string
    refresh_token: string
    expires_in: number
  }
}

export interface RefreshResponse {
  code: number
  message: string
  data: {
    access_token: string
    refresh_token?: string
    expires_in: number
  }
}

export interface RegisterResponse {
  code: number
  message: string
  data: {
    uid: number
    email: string
    nickname: string | null
    created_at: string
    access_token?: string
    refresh_token?: string
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
  return http.post('/auth/send-code', { email, purpose: 'register' })
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
 * 退出登录
 */
export function logout(): Promise<LogoutResponse> {
  return http.post('/auth/logout')
}

/**
 * 登录专用发送验证码
 */
export function sendLoginCode(email: string): Promise<SendCodeResponse> {
  return http.post('/auth/send-code', { email, purpose: 'login' })
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
  return http.post('/auth/send-code', { email, purpose: 'reset_password' })
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
