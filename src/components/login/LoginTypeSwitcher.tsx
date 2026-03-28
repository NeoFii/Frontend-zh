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

  return (
    <div className="flex gap-2 mb-8 relative font-tech-mono text-xs tracking-widest">
      {/* 核心动画：绝对定位的滑动高亮指示器 */}
      <div
        className="absolute bottom-0 h-[2px] bg-tech-accent shadow-[0_0_8px_#00d2ff] transition-transform duration-300 ease-out z-10"
        style={{
          width: 'calc(50% - 0.25rem)', // 50% 宽度减去 gap 间距的一半
          transform: loginType === 'password' ? 'translateX(0)' : 'translateX(calc(100% + 0.5rem))'
        }}
      />

      <button
        type="button"
        onClick={() => onChange('password')}
        className={`flex-1 py-3 transition-colors duration-300 border-b-2 border-transparent ${loginType === 'password'
            ? 'font-bold bg-white/80 text-tech-accent'
            : 'font-semibold bg-transparent text-tech-muted hover:text-tech-text hover:bg-white/30'
          }`}
      >
        [ {t('password') || '邮箱_密码'} ]
      </button>

      <button
        type="button"
        onClick={() => onChange('code')}
        className={`flex-1 py-3 transition-colors duration-300 border-b-2 border-transparent ${loginType === 'code'
            ? 'font-bold bg-white/80 text-tech-accent'
            : 'font-semibold bg-transparent text-tech-muted hover:text-tech-text hover:bg-white/30'
          }`}
      >
        [ {t('code') || '邮箱_验证码'} ]
      </button>
    </div>
  )
}