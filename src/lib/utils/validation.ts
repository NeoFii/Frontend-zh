/**
 * 验证工具函数
 * 统一管理表单验证逻辑
 */

/**
 * 邮箱验证
 * @param email 邮箱地址
 * @returns 是否有效
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 密码验证
 * @param password 密码
 * @returns 是否有效
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 8
}

/**
 * 验证码验证
 * @param code 验证码
 * @returns 是否有效（6位数字）
 */
export const validateCode = (code: string): boolean => {
  const codeRegex = /^\d{6}$/
  return codeRegex.test(code)
}
