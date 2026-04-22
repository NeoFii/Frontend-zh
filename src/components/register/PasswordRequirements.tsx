/**
 * 密码强度要求提示组件
 * 显示密码必须满足的要求列表
 */

import { getPasswordRequirementState } from '@/lib/utils/validation'

interface PasswordRequirementsProps {
  password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const state = getPasswordRequirementState(password)

  // 密码要求检查
  const requirements = [
    { key: 'minLength', label: '至少8个字符', met: state.minLength },
    { key: 'hasUppercase', label: '包含大写字母', met: state.hasUppercase },
    { key: 'hasLowercase', label: '包含小写字母', met: state.hasLowercase },
    { key: 'hasNumber', label: '包含数字', met: state.hasNumber },
    { key: 'hasSpecial', label: '包含特殊符号', met: state.hasSpecial },
  ]

  // 如果没有输入密码，不显示
  if (!password) return null

  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs text-gray-500 mb-1">密码要求：</p>
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
