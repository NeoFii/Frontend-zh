/**
 * 登录方式切换组件
 * 支持密码登录和邮箱验证码登录切换
 */

import { useTranslation } from '@/hooks/useTranslation'

interface LoginTypeSwitcherProps {
  loginType: 'password' | 'code'
  onChange: (type: 'password' | 'code') => void
}

export function LoginTypeSwitcher({ loginType, onChange }: LoginTypeSwitcherProps) {
  const { t } = useTranslation('auth.loginType')
  const codeLabel = t('code').replace(/^邮箱/, '')

  return (
    <div className="mb-8 flex border-b border-[#e5e7eb] text-sm font-medium">
      <button
        type="button"
        onClick={() => onChange('password')}
        className={`-mb-px flex-1 border-b-2 px-5 py-3 transition-colors ${loginType === 'password'
            ? 'border-[#f97316] text-[#111827]'
            : 'border-transparent text-[#6b7280] hover:text-[#374151]'
          }`}
      >
        {t('password') || '密码登录'}
      </button>

      <button
        type="button"
        onClick={() => onChange('code')}
        className={`-mb-px flex-1 border-b-2 px-5 py-3 transition-colors ${loginType === 'code'
            ? 'border-[#f97316] text-[#111827]'
            : 'border-transparent text-[#6b7280] hover:text-[#374151]'
          }`}
      >
        {codeLabel || '验证码登录'}
      </button>
    </div>
  )
}
