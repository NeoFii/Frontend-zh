/**
 * 密码强度指示器组件
 * 显示密码强度等级和视觉反馈
 */

import { useTranslation } from '@/hooks/useTranslation'
import { getPasswordStrength, PasswordStrengthResult } from '@/lib/utils/password'

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { t } = useTranslation('auth.register')
  const strength: PasswordStrengthResult = getPasswordStrength(password)

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              level <= strength.level ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">{t('passwordStrength')}</span>
        <span className={strength.color.replace('bg-', 'text-')}>
          {strength.text}
        </span>
      </div>
    </div>
  )
}
