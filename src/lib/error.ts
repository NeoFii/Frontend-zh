/**
 * 统一错误处理工具
 * 提供错误提取、格式化、用户提示等功能
 */

/**
 * 从错误对象中提取用户友好的错误消息
 */
export function extractErrorMessage(error: unknown): string {
  // Axios 错误
  if (typeof error === 'object' && error !== null) {
    const err = error as { response?: { data?: { message?: string } }; message?: string }

    // 后端返回的错误消息
    if (err.response?.data?.message) {
      return err.response.data.message
    }

    // 网络错误
    if (err.message?.includes('Network Error')) {
      return '网络请求失败，请检查网络连接'
    }

    // 超时错误
    if (err.message?.includes('timeout')) {
      return '请求超时，请稍后重试'
    }

    // 其他错误消息
    if (err.message) {
      return err.message
    }
  }

  // 默认错误消息
  return '操作失败，请稍后重试'
}

/**
 * API 错误代码映射
 */
const ERROR_MESSAGES: Record<string, string> = {
  // 认证相关
  401: '登录已过期，请重新登录',
  403: '没有权限执行此操作',

  // 客户端错误
  400: '请求参数错误',
  404: '请求的资源不存在',
  422: '提交的数据验证失败',

  // 服务端错误
  500: '服务器内部错误',
  502: '服务暂时不可用',
  503: '服务暂时不可用，请稍后重试',
}

/**
 * 根据 HTTP 状态码获取错误消息
 */
export function getErrorMessageByStatus(status: number | undefined): string {
  if (!status) return '网络请求失败'

  return ERROR_MESSAGES[String(status)] || '操作失败，请稍后重试'
}

/**
 * 完整的错误处理函数
 * 同时处理日志记录和用户提示
 */
export interface ErrorHandlerOptions {
  /** 是否在控制台打印日志 */
  logError?: boolean
  /** 自定义错误消息前缀 */
  prefix?: string
}

export function handleApiError(
  error: unknown,
  setError?: (message: string) => void,
  options: ErrorHandlerOptions = {}
): string {
  const { logError = true, prefix = '' } = options

  const status = (error as { response?: { status?: number } })?.response?.status
  let message = getErrorMessageByStatus(status)

  // 尝试获取后端返回的具体消息
  const backendMessage = extractErrorMessage(error)
  if (backendMessage && !backendMessage.includes('Network Error') && !backendMessage.includes('timeout')) {
    message = backendMessage
  }

  // 添加前缀
  const fullMessage = prefix ? `${prefix}: ${message}` : message

  // 控制台日志
  if (logError) {
    console.error(`API Error ${status ? `[${status}]` : ''}:`, error)
  }

  // 设置用户错误提示
  if (setError) {
    setError(fullMessage)
  }

  return fullMessage
}
