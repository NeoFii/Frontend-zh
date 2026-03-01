import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearAllTokens,
  isAccessTokenExpiringSoon,
} from '@/lib/token'
import { useAuthStore } from '@/stores/auth'

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1',
  timeout: 10000,
  withCredentials: true, // 允许发送 cookies（用于 CSRF 防护）
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============ Token 刷新相关状态 ============
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (error: Error) => void
}> = []

// 处理队列中的请求
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

// 刷新 Token 的核心逻辑
async function refreshToken(): Promise<string | null> {
  const refreshTokenValue = getRefreshToken()
  if (!refreshTokenValue) {
    return null
  }

  try {
    // 使用 axios 直接发送刷新请求（不使用拦截器，避免循环）
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshTokenValue}`,
        },
        withCredentials: true,
      }
    )

    const { access_token, refresh_token, expires_in } = response.data.data

    // 更新 Token
    setAccessToken(access_token, expires_in)
    if (refresh_token) {
      setRefreshToken(refresh_token)
    }

    return access_token
  } catch {
    // 刷新失败，清除所有 Token
    clearAllTokens()
    return null
  }
}

// 获取有效 Token（带刷新逻辑）
async function getValidToken(): Promise<string | null> {
  const token = getAccessToken()

  // Token 存在且未过期，直接返回
  if (token && !isAccessTokenExpiringSoon()) {
    return token
  }

  // 正在刷新中，等待刷新完成
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
  }

  // 开始刷新
  isRefreshing = true

  try {
    const newToken = await refreshToken()
    processQueue(null, newToken)
    return newToken
  } catch {
    processQueue(new Error('Refresh failed'), null)
    return null
  } finally {
    isRefreshing = false
  }
}

// 判断是否为认证接口（不需要 Token）
function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/send-code') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/reset-password')
  )
}

// 处理登出（统一跳转）
function handleLogout(): void {
  clearAllTokens()
  useAuthStore.getState().logout()
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

// ============ 请求拦截器 ============
apiClient.interceptors.request.use(
  async (config) => {
    // 排除认证相关接口
    if (isAuthEndpoint(config.url)) {
      return config
    }

    // 获取有效 Token（自动处理刷新）
    const token = await getValidToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (!isRefreshing) {
      // 没有有效 Token 且不在刷新中，可能是彻底失信
      // 稍后由响应拦截器处理
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ============ 响应拦截器 ============
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  async (error) => {
    const originalRequest = error.config

    // 详细错误日志
    console.error('API Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })

    // 非 401 错误直接抛出
    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    // 如果是刷新 Token 接口失败，不重试
    if (originalRequest?.url?.includes('/auth/refresh')) {
      handleLogout()
      return Promise.reject(error)
    }

    // 标记为已重试过，防止无限循环
    if (originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const newToken = await getValidToken()

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        }
      } catch {
        // 刷新失败，清除状态
        handleLogout()
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

// 通用请求方法封装
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T, T>(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T, T>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T, T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T, T>(url, config),
}
