/**
 * 登录表单组件
 * 处理登录逻辑和表单输入
 */

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/stores/auth'
import { setAccessToken } from '@/lib/token'
import { LoginTypeSwitcher } from './LoginTypeSwitcher'
import { CodeCountdown } from './CodeCountdown'
import { LoginError } from './LoginError'
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
    const res = await sendLoginCode(form.email)
    if (res.code !== 200) {
      setError(res.message || tErrors('sendFailed'))
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
        // 存储 Token（Refresh Token 由后端通过 httpOnly Cookie 管理）
        const { access_token, expires_in } = res.data
        setAccessToken(access_token, expires_in)
        // 保存用户信息到本地 store
        saveUser(res.data.user)
        onSuccess()
      } else {
        // 业务逻辑错误，直接使用后端返回的 message
        setError(res.message || tErrors('loginFailed'))
      }
    } catch (err: unknown) {
      // HTTP 错误，直接使用后端返回的 message
      const axiosError = err as { response?: { data?: { message?: string } } }
      const message = axiosError.response?.data?.message
      setError(message || tErrors('loginFailedRetry'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <LoginTypeSwitcher loginType={loginType} onChange={setLoginType} />

      <form onSubmit={handleLogin} className="space-y-5">
        <LoginError error={error} />

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            placeholder={t('emailPlaceholder')}
          />
        </div>

        {loginType === 'password' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('password')}</label>
            <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t('passwordPlaceholder')}
              required
            />
          </div>
        ) : (
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">{t('code')}</label>
            <div className="flex space-x-3">
              <input
                id="code"
                name="code"
                type="text"
                required
                maxLength={6}
                value={form.code}
                onChange={handleChange}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder={t('codePlaceholder')}
              />
              <CodeCountdown onSendCode={handleSendCode} />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('submitting') : t('submit')}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="text-gray-500 hover:text-gray-700">{t('forgotPassword')}</Link>
        <Link href="/register" className="text-gray-900 font-medium hover:text-gray-700">
          {t('noAccount')}{t('registerNow')}
        </Link>
      </div>
    </>
  )
}
