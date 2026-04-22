import { extractErrorMessage } from '@/lib/error'

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
