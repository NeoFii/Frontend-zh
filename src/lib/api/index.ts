import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token（仅在客户端）
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage)
          if (state.token) {
            config.headers.Authorization = `Bearer ${state.token}`
          }
        } catch {
          // 解析失败，忽略
        }
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      const { status, data } = error.response
      console.error(`API Error ${status}:`, data)

      switch (status) {
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器内部错误')
          break
        default:
          console.error(data.message || '请求失败')
      }
    } else if (error.request) {
      console.error('网络请求失败，请检查网络连接')
    } else {
      console.error('请求配置错误:', error.message)
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
