import { http } from './index'

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  email: string
  password: string
  name: string
}

export interface User {
  id: number
  email: string
  name: string
}

export interface AuthResponse {
  code: string
  message: string
  data: {
    token: string
    user: User
  }
}

/**
 * 用户登录
 */
export function login(params: LoginParams): Promise<AuthResponse> {
  return http.post('/auth/login', params)
}

/**
 * 用户注册
 */
export function register(params: RegisterParams): Promise<AuthResponse> {
  return http.post('/auth/register', params)
}

/**
 * 发送验证码
 */
export function sendVerificationCode(email: string): Promise<AuthResponse> {
  return http.post('/auth/send-code', { email })
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser(): Promise<AuthResponse> {
  return http.get('/auth/me')
}

/**
 * 退出登录
 */
export function logout(): Promise<AuthResponse> {
  return http.post('/auth/logout')
}
