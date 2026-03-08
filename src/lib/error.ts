/**
 * 统一错误处理工具
 * 提供错误提取、格式化、用户提示等功能
 */

import messages from '@/messages/zh.json'

function getNestedValue(obj: unknown, keys: string[]): string | undefined {
  let result = obj
  for (const k of keys) {
    if (result == null || typeof result !== 'object') return undefined
    result = (result as Record<string, unknown>)[k]
  }
  return typeof result === 'string' ? result : undefined
}

function t(key: string): string {
  return getNestedValue(messages, key.split('.')) || key
}

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
      return t('errors.networkError')
    }

    // 超时错误
    if (err.message?.includes('timeout')) {
      return t('errors.timeoutError')
    }

    // 其他错误消息
    if (err.message) {
      return err.message
    }
  }

  // 默认错误消息
  return t('errors.operationFailed')
}

/**
 * API 错误代码映射
 */
const ERROR_MESSAGES: Record<string, string> = {
  // 认证相关
  401: t('errors.unauthorized'),
  403: t('errors.forbidden'),

  // 客户端错误
  400: t('errors.badRequest'),
  404: t('errors.notFound'),
  422: t('errors.validationFailed'),

  // 服务端错误
  500: t('errors.serverError'),
  502: t('errors.badGateway'),
  503: t('errors.serviceUnavailable'),
}

/**
 * 根据 HTTP 状态码获取错误消息
 */
export function getErrorMessageByStatus(status: number | undefined): string {
  if (!status) return t('errors.networkError')

  return ERROR_MESSAGES[String(status)] || t('errors.operationFailed')
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
