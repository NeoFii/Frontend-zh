import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { clearAllTokens, getAccessToken, isAccessTokenExpiringSoon, setAccessToken } from '@/lib/token'
import { DEFAULT_USER_API_BASE_URL } from '@/lib/config'
import proxyConfig from '@/lib/proxy-config'
import { safeJsonParse } from '@/lib/utils/safe-json'

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let refreshPromise: Promise<string | null> | null = null

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) {
    return false
  }

  return (
    url.includes('/auth/login') ||
    url.includes('/auth/logout') ||
    url.includes('/auth/register') ||
    url.includes('/auth/send-code') ||
    url.includes('/auth/send-email-code') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/reset-password') ||
    url.includes('/auth/login-with-code') ||
    url.includes('/auth/verify-email')
  )
}

function isSessionProbeEndpoint(url: string | undefined): boolean {
  if (!url) {
    return false
  }

  return url.includes('/auth/me')
}

function logApiError(config: RetryableRequestConfig | undefined, status: number | undefined) {
  const requestUrl = `${config?.baseURL || ''}${config?.url || ''}`
  if (status === 401 && (isSessionProbeEndpoint(requestUrl) || isAuthEndpoint(requestUrl))) {
    return
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', {
      url: config?.url,
      method: config?.method,
      status,
    })
    return
  }

  console.error('API Error:', { status })
}

async function handleLogout(refreshBaseURL: string) {
  clearAllTokens()

  // ✅ 动态引入 Store：只有在触发登出时才去加载 auth.ts，完美避开初始化时的循环依赖
  const { useAuthStore } = await import('@/stores/auth')
  useAuthStore.getState().logout()

  try {
    await axios.post(
      `${refreshBaseURL}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    )
  } catch {
    // Best effort cookie cleanup. Ignore network/auth failures here.
  }
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

async function performRefresh(refreshBaseURL: string): Promise<string | null> {
  const response = await axios.post(
    `${refreshBaseURL}/auth/refresh`,
    {},
    {
      withCredentials: true,
    }
  )

  const { access_token, expires_in } = response.data.data
  setAccessToken(access_token, expires_in)
  return access_token
}

async function refreshAccessToken(refreshBaseURL: string): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = performRefresh(refreshBaseURL)
      .catch(() => {
        clearAllTokens()
        return null
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

async function getValidToken(refreshBaseURL: string): Promise<string | null> {
  const token = getAccessToken()
  if (token && !isAccessTokenExpiringSoon()) {
    return token
  }

  return refreshAccessToken(refreshBaseURL)
}

function applyAuthorizationHeader(config: RetryableRequestConfig, token: string) {
  config.headers = config.headers ?? {}
  config.headers.Authorization = `Bearer ${token}`
}

export function createApiClient(
  baseURL: string,
  options?: {
    refreshBaseURL?: string
  }
): AxiosInstance {
  const refreshBaseURL =
    options?.refreshBaseURL || proxyConfig.resolvePublicApiBaseUrl() || DEFAULT_USER_API_BASE_URL
  const apiClient = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    transformResponse: [
      (data: string) => {
        if (typeof data !== 'string') return data
        try {
          return safeJsonParse(data)
        } catch {
          return data
        }
      },
    ],
  })

  apiClient.interceptors.request.use(
    async (config) => {
      const requestConfig = config as RetryableRequestConfig
      const fullUrl = `${requestConfig.baseURL || ''}${requestConfig.url || ''}`
      if (isAuthEndpoint(fullUrl) || isSessionProbeEndpoint(fullUrl)) {
        return requestConfig
      }

      const token = await getValidToken(refreshBaseURL)
      if (token) {
        applyAuthorizationHeader(requestConfig, token)
      }

      return requestConfig
    },
    (error) => Promise.reject(error)
  )

  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    async (error) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined
      const status = error.response?.status as number | undefined

      logApiError(originalRequest, status)

      if (status !== 401 || !originalRequest) {
        return Promise.reject(error)
      }

      const requestUrl = `${originalRequest.baseURL || ''}${originalRequest.url || ''}`
      if (requestUrl.includes('/auth/logout')) {
        return Promise.reject(error)
      }

      // /auth/me is used as a passive session probe. Let callers handle 401/403
      // instead of forcing a redirect loop on public pages like / and /login.
      if (isSessionProbeEndpoint(requestUrl)) {
        return Promise.reject(error)
      }

      if (requestUrl.includes('/auth/refresh')) {
        await handleLogout(refreshBaseURL)
        return Promise.reject(error)
      }

      if (isAuthEndpoint(requestUrl)) {
        return Promise.reject(error)
      }

      if (originalRequest._retry) {
        await handleLogout(refreshBaseURL)
        return Promise.reject(error)
      }

      originalRequest._retry = true

      const refreshedToken = await refreshAccessToken(refreshBaseURL)
      if (!refreshedToken) {
        await handleLogout(refreshBaseURL)
        return Promise.reject(error)
      }

      applyAuthorizationHeader(originalRequest, refreshedToken)
      return apiClient(originalRequest)
    }
  )

  return apiClient
}

export function createHttpMethods(apiClient: AxiosInstance) {
  return {
    get: <T>(url: string, config?: AxiosRequestConfig) => apiClient.get<T, T>(url, config),
    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      apiClient.post<T, T>(url, data, config),
    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      apiClient.put<T, T>(url, data, config),
    patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      apiClient.patch<T, T>(url, data, config),
    delete: <T>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T, T>(url, config),
  }
}
