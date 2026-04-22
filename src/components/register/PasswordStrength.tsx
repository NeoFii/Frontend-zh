/**
 * 密码强度指示器组件
 * 显示密码强度等级和视觉反馈
 */

import { getPasswordStrength, PasswordStrengthResult } from '@/lib/utils/password'

// 密码强度 key 到中文标签的映射
const strengthTextMap: Record<string, string> = {
  weak: '弱',
  fair: '一般',
  strong: '强',
  veryStrong: '非常强',
}

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength: PasswordStrengthResult = getPasswordStrength(password)

  if (!password) return null

  const strengthLabel = strengthTextMap[strength.text] || strength.text

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${level <= strength.level ? strength.color : 'bg-gray-200'
              }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">密码要求</span>
        <span className={strength.color.replace('bg-', 'text-')}>
          {strengthLabel}
        </span>
      </div>
    </div>
  )
}