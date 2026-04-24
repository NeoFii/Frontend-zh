import { extractErrorMessage, normalizeResponseMessage } from '@/lib/error'

describe('extractErrorMessage', () => {
  it('应将已知英文错误码映射为中文', () => {
    const error = { response: { data: { message: 'VOUCHER_NOT_FOUND' } } }
    expect(extractErrorMessage(error)).toBe('兑换码无效，请检查后重试')
  })

  it('应将已知认证错误码映射为中文', () => {
    const error = { response: { data: { message: 'invalid_credentials' } } }
    expect(extractErrorMessage(error)).toBe('邮箱或密码错误')
  })

  it('应透传后端返回的中文消息', () => {
    const error = { response: { data: { message: '后端错误消息' } } }
    expect(extractErrorMessage(error)).toBe('后端错误消息')
  })

  it('未知英文错误码应按 HTTP 状态码兜底', () => {
    const error = { response: { status: 422, data: { message: 'some_unknown_code' } } }
    expect(extractErrorMessage(error)).toBe('输入信息有误，请检查后重试')
  })

  it('无消息时应按 HTTP 状态码兜底', () => {
    const error = { response: { status: 429 } }
    expect(extractErrorMessage(error)).toBe('请求过于频繁，请稍后重试')
  })

  it('应处理网络错误', () => {
    const error = { message: 'Network Error' }
    expect(extractErrorMessage(error)).toBe('网络请求失败，请检查网络连接')
  })

  it('应处理超时错误', () => {
    const error = { message: 'timeout of 10000ms exceeded' }
    expect(extractErrorMessage(error)).toBe('请求超时，请稍后重试')
  })

  it('应过滤原始 JS 错误消息', () => {
    const error = { message: 'Request failed with status code 500' }
    expect(extractErrorMessage(error)).toBe('操作失败，请稍后重试')
  })

  it('应透传中文的 err.message', () => {
    const error = { message: '未知错误' }
    expect(extractErrorMessage(error)).toBe('未知错误')
  })

  it('应处理 null 和 undefined', () => {
    expect(extractErrorMessage(null)).toBe('操作失败，请稍后重试')
    expect(extractErrorMessage(undefined)).toBe('操作失败，请稍后重试')
  })
})

describe('normalizeResponseMessage', () => {
  it('应将已知英文错误码映射为中文', () => {
    expect(normalizeResponseMessage('invalid_code', '发送失败')).toBe('验证码错误或已过期')
  })

  it('应透传中文消息', () => {
    expect(normalizeResponseMessage('邮箱已注册', '注册失败')).toBe('邮箱已注册')
  })

  it('undefined 时应返回 fallback', () => {
    expect(normalizeResponseMessage(undefined, '发送失败')).toBe('发送失败')
  })

  it('未知英文消息应返回 fallback', () => {
    expect(normalizeResponseMessage('weird_error', '操作失败')).toBe('操作失败')
  })
})
