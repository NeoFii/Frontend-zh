/**
 * 登录表单组件
 * 处理登录逻辑和表单输入
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/stores/auth'
import { setAccessToken } from '@/lib/token'
import { LoginTypeSwitcher } from './LoginTypeSwitcher'
import { CodeCountdown } from '@/components/ui/CodeCountdown'
import { FormAlert } from '@/components/ui/FormAlert'
import { login, loginWithCode, sendLoginCode } from '@/lib/api/auth'
import { validateEmail } from '@/lib/utils/validation'
import { PasswordInput } from '@/components/ui/PasswordInput'

interface LoginFormProps {
  onSuccess: () => void
}

interface FormData {
  email: string
  password: string
  code: string
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation('auth.login')
  const { t: tValidation } = useTranslation('auth.validation')
  const { t: tErrors } = useTranslation('auth.errors')
  const { login: saveUser } = useAuthStore()

  const [loginType, setLoginType] = useState<'password' | 'code'>('password')
  const [form, setForm] = useState<FormData>({
    email: '',
    password: '',
    code: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ================= 终端打字机特效逻辑 =================
  const [targetText, setTargetText] = useState('等待建立加密连接...')
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let i = 0;

    setDisplayedText('');

    const typeWriter = () => {
      if (i < targetText.length) {
        setDisplayedText(targetText.slice(0, i + 1));
        i++;
        timeoutId = setTimeout(typeWriter, Math.random() * 30 + 20);
      }
    };

    timeoutId = setTimeout(typeWriter, 50);

    return () => clearTimeout(timeoutId);
  }, [targetText]);
  // =======================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSendCode = async () => {
    if (!form.email) {
      setError(tValidation('enterEmail'))
      return
    }

    if (!validateEmail(form.email)) {
      setError(tValidation('invalidEmail'))
      return
    }

    setError('')
    try {
      const res = await sendLoginCode(form.email)
      if (res.code !== 200) {
        setError(res.message || tErrors('sendFailed'))
      }
    } catch {
      setError(tErrors('sendFailed'))
    }
  }

  const validateForm = (): boolean => {
    if (!form.email) {
      setError(tValidation('enterEmail'))
      return false
    }

    if (loginType === 'password' && !form.password) {
      setError(tValidation('enterPassword'))
      return false
    }

    if (loginType === 'code' && !form.code) {
      setError(tValidation('enterCode'))
      return false
    }

    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError('')
    setTargetText('正在验证安全密钥...')

    try {
      let res
      if (loginType === 'password') {
        res = await login({
          email: form.email,
          password: form.password,
        })
      } else {
        res = await loginWithCode({
          email: form.email,
          code: form.code,
        })
      }

      if (res.code === 200) {
        setTargetText('认证通过，路由分配中...')
        const { access_token, expires_in } = res.data
        setAccessToken(access_token, expires_in)
        saveUser(res.data.user)
        onSuccess()
      } else {
        setError(res.message || tErrors('loginFailed'))
        setTargetText('>> 认证被拒绝')
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      const message = axiosError.response?.data?.message
      setError(message || tErrors('loginFailedRetry'))
      setTargetText('>> 连接超时或网络异常')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (type: 'password' | 'code') => {
    setLoginType(type)
    if (type === 'password') {
      setTargetText('已切换至 [邮箱密码] 校验协议。')
    } else {
      setTargetText('已切换至 [邮箱验证码] 协议。')
    }
  }

  const cyberInputClass = "w-full px-4 py-3.5 bg-white/70 border border-slate-300 border-l-slate-300 border-l-[3px] rounded transition-all focus:border-tech-accent/50 focus:border-l-tech-accent focus:bg-white focus:outline-none focus:shadow-[inset_0_0_15px_rgba(0,210,255,0.05),0_0_15px_rgba(0,210,255,0.1)] font-tech-mono text-sm tracking-widest text-tech-text placeholder-slate-400"

  return (
    <>
      <div className="bg-slate-100/60 border border-slate-200/80 p-3 mb-8 rounded font-tech-mono text-xs shadow-inner relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-tech-accent/60"></div>
        <div className="flex items-center text-tech-text h-4">
          <span className="text-tech-accent font-bold mr-2 opacity-80 shrink-0">系统&gt;</span>
          <span>{displayedText}</span>
          <span className="inline-block w-[6px] h-[14px] bg-tech-accent align-middle ml-1 animate-[blink_1s_step-end_infinite] shrink-0"></span>
        </div>
      </div>

      <LoginTypeSwitcher loginType={loginType} onChange={handleTabChange} />

      <form onSubmit={handleLogin} className="space-y-6">
        <FormAlert error={error} />

        <div className="relative group">
          <div className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-tech-mono text-tech-muted font-bold z-10 uppercase tracking-wider">
            {t('email') || '邮箱地址'}
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            onFocus={() => setTargetText(loginType === 'code' ? '请输入邮箱以下发一次性秘钥。' : '请输入邮箱以校验身份。')}
            onBlur={() => setTargetText('等待输入...')}
            className={cyberInputClass}
            placeholder={t('emailPlaceholder') || '请输入您的邮箱'}
          />
        </div>

        {/* 核心动画：加入 key={loginType} 和 animate-fade-in 触发平滑切入 */}
        <div key={loginType} className="animate-fade-in">
          {loginType === 'password' ? (
            <div className="relative group mt-6">
              <div className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-tech-mono text-tech-muted font-bold z-10 uppercase tracking-wider">
                {t('password') || '安全密钥'}
              </div>
              <div onFocus={() => setTargetText('请输入密码以完成登录。')} onBlur={() => setTargetText('等待输入...')}>
                <PasswordInput
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={t('passwordPlaceholder') || '请输入您的密码'}
                  required
                  className={cyberInputClass}
                />
              </div>
            </div>
          ) : (
            <div className="flex gap-3 relative mt-6">
              <div className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-tech-mono text-tech-muted font-bold z-10 uppercase tracking-wider">
                {t('code') || '临时令牌'}
              </div>
              <input
                id="code"
                name="code"
                type="text"
                required
                maxLength={6}
                value={form.code}
                onChange={handleChange}
                onFocus={() => setTargetText('请输入临时令牌。')}
                onBlur={() => setTargetText('等待输入...')}
                className={`${cyberInputClass} text-center tracking-[0.5em]`}
                placeholder={t('codePlaceholder') || '请输入验证码'}
              />
              <div className="shrink-0 flex items-center">
                <CodeCountdown
                  onSendCode={handleSendCode}
                  sendingText={t('sending')}
                  getCodeText={t('getCode')}
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="relative w-full mt-10 bg-tech-text text-white py-4 rounded font-tech-mono text-sm tracking-[0.3em] font-bold hover:bg-[#0B1121]/90 transition-all overflow-hidden group shadow-[0_5px_20px_rgba(11,17,33,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? t('submitting') : (t('submit') || '立即登录_享受智能路由')}
            {!loading && (
              <svg className="w-4 h-4 text-tech-accent group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            )}
          </span>
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        </button>
      </form>

      <div className="mt-6 border-t border-slate-200/80 pt-4 flex items-center justify-between text-[10px] font-tech-mono text-tech-muted uppercase">
        <Link href="/forgot-password" className="hover:text-tech-accent transition-colors flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          {t('forgotPassword') || '忘记密码'}
        </Link>
        <Link href="/register" className="hover:text-tech-accent font-bold transition-colors text-tech-text">
          &gt; 申请_账号
        </Link>
      </div>
    </>
  )
}