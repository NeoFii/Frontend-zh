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
  const requirements = getPasswordRequirementState(password)
  return Object.values(requirements).every(Boolean)
}

export interface PasswordRequirementState {
  minLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

export const getPasswordRequirementState = (password: string): PasswordRequirementState => ({
  minLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecial: /[^a-zA-Z0-9]/.test(password),
})

/**
 * 验证码验证
 * @param code 验证码
 * @returns 是否有效（6位数字）
 */
export const validateCode = (code: string): boolean => {
  const codeRegex = /^\d{6}$/
  return codeRegex.test(code)
}
