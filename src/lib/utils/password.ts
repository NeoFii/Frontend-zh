/**
 * 密码强度计算工具
 * 用于注册页面的密码强度验证
 */

export interface PasswordStrengthResult {
  level: number
  text: string
  color: string
}

/**
 * 计算密码强度
 * @param password 要检查的密码
 * @returns 强度结果对象
 */
export function getPasswordStrength(password: string): PasswordStrengthResult {
  if (!password) return { level: 0, text: '', color: '' }

  let score = 0

  // 长度检查
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // 复杂度检查
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  // 根据分数返回强度等级
  if (score <= 2) return { level: 1, text: 'Weak', color: 'bg-red-500' }
  if (score <= 3) return { level: 2, text: 'Fair', color: 'bg-yellow-500' }
  if (score <= 4) return { level: 3, text: 'Strong', color: 'bg-green-500' }
  return { level: 4, text: 'Very Strong', color: 'bg-green-600' }
}
