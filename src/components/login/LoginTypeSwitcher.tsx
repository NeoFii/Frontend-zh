/**
 * 登录方式切换组件
 * 支持密码登录和邮箱验证码登录切换
 */

import { useTranslations } from 'next-intl'

interface LoginTypeSwitcherProps {
  loginType: 'password' | 'code'
  onChange: (type: 'password' | 'code') => void
}

export function LoginTypeSwitcher({ loginType, onChange }: LoginTypeSwitcherProps) {
  const t = useTranslations('auth.loginType')

  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        onClick={() => onChange('password')}
        className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
          loginType === 'password' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {t('password')}
        {loginType === 'password' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>}
      </button>
      <button
        onClick={() => onChange('code')}
        className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
          loginType === 'code' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {t('code')}
        {loginType === 'code' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>}
      </button>
    </div>
  )
}
