import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1',
  timeout: 10000,
  withCredentials: true, // 允许发送 cookies（用于认证）
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 后端使用 HttpOnly Cookie 进行认证，浏览器会自动发送 Cookie
    // 无需手动设置 Authorization header
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
    // 详细错误日志
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })

    // 统一错误处理
    if (error.response) {
      const { status, data } = error.response
      console.error(`API Error ${status}:`, data)

      // 对于登录相关接口，不自动跳转，让调用者处理错误
      const isAuthEndpoint = error.config?.url?.includes('/auth/')

      if (!isAuthEndpoint) {
        switch (status) {
          case 401:
            // 未登录或登录过期，跳转到登录页
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            break
          case 404:
            console.error('请求的资源不存在')
            break
          case 500:
            console.error('服务器内部错误')
            break
          default:
            console.error(data.message || '请求失败')
        }
      }
    } else if (error.request) {
      // 网络错误
      console.error('网络请求失败，请检查网络连接或后端服务')
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
