/**
 * 错误处理工具测试
 */

import {
  extractErrorMessage,
  getErrorMessageByStatus,
  handleApiError,
} from '@/lib/error'

describe('extractErrorMessage', () => {
  it('应从 Axios 响应中提取后端消息', () => {
    const error = {
      response: {
        data: {
          message: '后端错误消息',
        },
      },
    }
    expect(extractErrorMessage(error)).toBe('后端错误消息')
  })

  it('应处理网络错误', () => {
    const error = {
      message: 'Network Error',
    }
    expect(extractErrorMessage(error)).toBe('网络请求失败，请检查网络连接')
  })

  it('应处理超时错误', () => {
    const error = {
      message: 'timeout of 10000ms exceeded',
    }
    expect(extractErrorMessage(error)).toBe('请求超时，请稍后重试')
  })

  it('应返回默认消息', () => {
    const error = {
      message: '未知错误',
    }
    expect(extractErrorMessage(error)).toBe('未知错误')
  })

  it('应处理 null 和 undefined', () => {
    expect(extractErrorMessage(null)).toBe('操作失败，请稍后重试')
    expect(extractErrorMessage(undefined)).toBe('操作失败，请稍后重试')
  })
})

describe('getErrorMessageByStatus', () => {
  it('401 应返回登录过期消息', () => {
    expect(getErrorMessageByStatus(401)).toBe('登录已过期，请重新登录')
  })

  it('403 应返回无权限消息', () => {
    expect(getErrorMessageByStatus(403)).toBe('没有权限执行此操作')
  })

  it('404 应返回资源不存在消息', () => {
    expect(getErrorMessageByStatus(404)).toBe('请求的资源不存在')
  })

  it('500 应返回服务器内部错误消息', () => {
    expect(getErrorMessageByStatus(500)).toBe('服务器内部错误')
  })

  it('未知状态码应返回默认消息', () => {
    expect(getErrorMessageByStatus(999)).toBe('操作失败，请稍后重试')
  })

  it('undefined 应返回网络请求失败', () => {
    expect(getErrorMessageByStatus(undefined)).toBe('网络请求失败')
  })
})

describe('handleApiError', () => {
  it('应调用 setError 设置错误消息', () => {
    const setError = jest.fn()
    const error = {
      response: {
        status: 401,
        data: { message: '登录已过期' },
      },
    }

    handleApiError(error, setError)

    expect(setError).toHaveBeenCalledWith('登录已过期')
  })

  it('应返回错误消息字符串', () => {
    const setError = jest.fn()
    const error = {
      response: {
        status: 500,
        data: { message: '服务器错误' },
      },
    }

    const message = handleApiError(error, setError)

    expect(message).toBe('服务器错误')
  })
})
