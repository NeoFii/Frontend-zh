const ERROR_MESSAGE_MAP: Record<string, string> = {
  'invalid_credentials':        '邮箱或密码错误',
  'Invalid credentials':        '邮箱或密码错误',
  'invalid_code':               '验证码错误或已过期',
  'Invalid code':               '验证码错误或已过期',
  'code_expired':               '验证码已过期，请重新获取',
  'email_already_exists':       '该邮箱已注册',
  'Email already exists':       '该邮箱已注册',
  'email_not_found':            '该邮箱未注册',
  'Email not found':            '该邮箱未注册',
  'user_disabled':              '账户已被禁用，请联系客服',
  'too_many_requests':          '请求过于频繁，请稍后重试',
  'password_mismatch':          '当前密码错误',
  'invalid_password':           '密码格式不正确',
  'email_not_verified':         '邮箱未验证',
  'token_expired':              '登录已过期，请重新登录',
  'unauthorized':               '请先登录',
  'Unauthorized':               '请先登录',
  'VOUCHER_ALREADY_REDEEMED':   '该兑换码已被使用',
  'voucher_already_redeemed':   '该兑换码已被使用',
  'VOUCHER_EXPIRED':            '该兑换码已过期',
  'voucher_expired':            '该兑换码已过期',
  'VOUCHER_NOT_FOUND':          '兑换码无效，请检查后重试',
  'voucher_not_found':          '兑换码无效，请检查后重试',
  'VOUCHER_DISABLED':           '该兑换码已被禁用',
  'voucher_disabled':           '该兑换码已被禁用',
  'invalid_voucher_code':       '兑换码格式不正确',
  'key_not_found':              'API Key 不存在',
  'key_already_disabled':       '该 API Key 已被禁用',
  'quota_exceeded':             'API Key 额度已用完',
  'key_expired':                'API Key 已过期',
  'insufficient_balance':       '余额不足',
  'validation_error':           '输入信息有误，请检查后重试',
  'Validation error':           '输入信息有误，请检查后重试',
  'internal_server_error':      '服务器异常，请稍后重试',
  'service_unavailable':        '服务暂时不可用，请稍后重试',
  'forbidden':                  '没有权限执行此操作',
  'Forbidden':                  '没有权限执行此操作',
  'not_found':                  '请求的资源不存在',
  'Not Found':                  '请求的资源不存在',
}

const HTTP_STATUS_MESSAGE_MAP: Record<number, string> = {
  400: '请求参数有误，请检查后重试',
  401: '请先登录',
  403: '没有权限执行此操作',
  404: '请求的资源不存在',
  409: '操作冲突，请刷新后重试',
  422: '输入信息有误，请检查后重试',
  429: '请求过于频繁，请稍后重试',
  500: '服务器异常，请稍后重试',
  502: '服务暂时不可用，请稍后重试',
  503: '服务暂时不可用，请稍后重试',
}

function isChinese(text: string): boolean {
  return /[一-鿿]/.test(text)
}

function mapMessage(message: string): string | undefined {
  return ERROR_MESSAGE_MAP[message] || ERROR_MESSAGE_MAP[message.trim()]
}

export function extractErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as {
      response?: { status?: number; data?: { message?: string } }
      message?: string
    }

    const backendMessage = err.response?.data?.message
    if (backendMessage) {
      const mapped = mapMessage(backendMessage)
      if (mapped) return mapped
      if (isChinese(backendMessage)) return backendMessage
    }

    const status = err.response?.status
    if (status && HTTP_STATUS_MESSAGE_MAP[status]) {
      return HTTP_STATUS_MESSAGE_MAP[status]
    }

    if (err.message?.includes('Network Error')) {
      return '网络请求失败，请检查网络连接'
    }

    if (err.message?.includes('timeout')) {
      return '请求超时，请稍后重试'
    }

    if (err.message && isChinese(err.message)) {
      return err.message
    }
  }

  return '操作失败，请稍后重试'
}

export function normalizeResponseMessage(message: string | undefined, fallback: string): string {
  if (!message) return fallback
  const mapped = mapMessage(message)
  if (mapped) return mapped
  if (isChinese(message)) return message
  return fallback
}
