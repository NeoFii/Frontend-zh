/**
 * 登录表单组件
 * 处理登录逻辑和表单输入
 */

import { useState } from 'react'
import Link from 'next/link'
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
  const { login: saveUser } = useAuthStore()

  const [loginType, setLoginType] = useState<'password' | 'code'>('password')
  const [form, setForm] = useState<FormData>({
    email: '',
    password: '',
    code: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      setError('请先输入邮箱')
      return
    }

    if (!validateEmail(form.email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setError('')
    try {
      const res = await sendLoginCode(form.email)
      if (res.code !== 200) {
        setError(res.message || '发送失败')
      }
    } catch {
      setError('发送失败')
    }
  }

  const validateForm = (): boolean => {
    if (!form.email) {
      setError('请先输入邮箱')
      return false
    }

    if (loginType === 'password' && !form.password) {
      setError('请填写密码')
      return false
    }

    if (loginType === 'code' && !form.code) {
      setError('请填写验证码')
      return false
    }

    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const res = loginType === 'password'
        ? await login({
          email: form.email,
          password: form.password,
        })
        : await loginWithCode({
          email: form.email,
          code: form.code,
        })

      if (res.code === 200) {
        const { access_token, expires_in } = res.data
        setAccessToken(access_token, expires_in)
        saveUser(res.data.user)
        onSuccess()
      } else {
        setError(res.message || '登录失败')
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      const message = axiosError.response?.data?.message
      setError(message || '登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'h-11 w-full rounded-md border border-[#e5e7eb] bg-white px-3.5 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#f97316] focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)]'

  return (
    <div>
      <LoginTypeSwitcher loginType={loginType} onChange={setLoginType} />

      <div className="mb-7">
        <h1 className="mb-2 text-[28px] font-semibold tracking-[-0.015em] text-[#111827]">欢迎回来</h1>
        <p className="m-0 text-sm text-[#6b7280]">使用你的账户继续。</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <FormAlert error={error} />

        <div>
          <label htmlFor="email" className="mb-1.5 block font-mono text-xs uppercase tracking-[0.06em] text-[#6b7280]">
            {'邮箱'}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder={'请输入邮箱'}
          />
        </div>

        <div key={loginType} className="animate-fade-in">
          {loginType === 'password' ? (
            <div>
              <label htmlFor="password" className="mb-1.5 block font-mono text-xs uppercase tracking-[0.06em] text-[#6b7280]">
                {'密码'}
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={'请输入密码'}
                required
                className={`${inputClass} pr-12`}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="code" className="mb-1.5 block font-mono text-xs uppercase tracking-[0.06em] text-[#6b7280]">
                {'验证码'}
              </label>
              <div className="flex gap-3">
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  maxLength={6}
                  value={form.code}
                  onChange={handleChange}
                  className={`${inputClass} text-center tracking-[0.35em]`}
                  placeholder={'请输入验证码'}
                />
                <CodeCountdown
                  onSendCode={handleSendCode}
                  sendingText={'发送中...'}
                  getCodeText={'获取验证码'}
                  className="h-11 shrink-0 whitespace-nowrap rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-4 font-mono text-xs text-[#374151] transition hover:border-[#d1d5db] hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-[46px] w-full rounded-md bg-[#111827] text-sm font-medium text-white transition hover:-translate-y-px hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {loading ? '登录中...' : '立即登录'}
        </button>
      </form>

      <div className="mt-4 text-right">
        <Link href="/forgot-password" className="text-[12.5px] text-[#6b7280] transition hover:text-[#111827]">
          {'忘记密码？'}
        </Link>
      </div>

      <p className="mt-8 text-center text-[13px] leading-7 text-[#6b7280]">
        还没有账号？
        <Link href="/register" className="text-[#111827] underline decoration-[#d1d5db] underline-offset-4 transition hover:decoration-[#f97316]">
          立即注册
        </Link>
      </p>
    </div>
  )
}
