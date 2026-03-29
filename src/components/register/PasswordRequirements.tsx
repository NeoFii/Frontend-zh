/**
 * 密码强度要求提示组件
 * 显示密码必须满足的要求列表
 */

import { useTranslation } from '@/hooks/useTranslation'

interface PasswordRequirementsProps {
  password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const { t } = useTranslation('auth.common')

  // 密码要求检查
  const requirements = [
    { key: 'minLength', label: t('passwordMinLength'), met: password.length >= 8 },
    { key: 'hasNumber', label: t('passwordHasNumber'), met: /\d/.test(password) },
    { key: 'hasLetter', label: t('passwordHasLetter'), met: /[a-zA-Z]/.test(password) },
  ]

  // 如果没有输入密码，不显示
  if (!password) return null

  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs text-gray-500 mb-1">{t('passwordRequirements')}：</p>
      <div className="flex flex-wrap gap-2">
        {requirements.map((req) => (
          <span
            key={req.key}
            className={`text-xs px-2 py-0.5 rounded-full transition-colors ${req.met
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
              }`}
          >
            {req.met ? '✓' : '○'} {req.label}
          </span>
        ))}
      </div>
    </div>
  )
}