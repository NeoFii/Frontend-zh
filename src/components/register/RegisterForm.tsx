/**
 * 注册表单组件
 * 处理注册逻辑和表单输入
 */

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { PasswordStrength } from './PasswordStrength'
import { PasswordRequirements } from './PasswordRequirements'
import { AgreementLinks } from './AgreementLinks'
import { RegisterError } from './RegisterError'
import { CodeCountdown } from './CodeCountdown'
import { useAuthStore } from '@/stores/auth'
import { setAccessToken } from '@/lib/token'
import { sendVerificationCode, register } from '@/lib/api/auth'
import { validateEmail } from '@/lib/utils/validation'
import { PasswordInput } from '@/components/ui/PasswordInput'

interface RegisterFormProps {
  onSuccess?: () => void
}

interface FormData {
  invitationCode: string
  email: string
  code: string
  password: string
  confirmPassword: string
  agreement: boolean
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter()
  const t = useTranslations('auth.register')
  const tValidation = useTranslations('auth.validation')
  const tErrors = useTranslations('auth.errors')
  const { login: saveUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [codeLoading, setCodeLoading] = useState(false)

  const [form, setForm] = useState<FormData>({
    invitationCode: '',
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
    agreement: false,
  })

  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

    setCodeLoading(true)
    setError('')

    try {
      const res = await sendVerificationCode(form.email)
      if (res.code !== 200) {
        setError(res.message || tErrors('sendFailed'))
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || tErrors('sendFailed'))
    } finally {
      setCodeLoading(false)
    }
  }

  const validateForm = (): boolean => {
    if (!form.invitationCode.trim()) {
      setError(tValidation('enterInvitationCode'))
      return false
    }
    if (!form.agreement) {
      setError(tValidation('agreeToTerms'))
      return false
    }
    if (!form.email || !form.code || !form.password || !form.confirmPassword) {
      setError(tValidation('fillAllRequired'))
      return false
    }
    if (form.password !== form.confirmPassword) {
      setError(tValidation('passwordMismatch'))
      return false
    }
    if (form.password.length < 8) {
      setError(tValidation('passwordTooShort'))
      return false
    }
    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await register({
        invitation_code: form.invitationCode.trim(),
        email: form.email,
        verification_code: form.code,
        password: form.password,
        confirm_password: form.confirmPassword,
      })

      if (res.code === 201) {
        // 检查是否有 Token（注册成功后自动登录）
        if (res.data.access_token && res.data.expires_in) {
          // 存储 Token（Refresh Token 由后端通过 httpOnly Cookie 管理）
          setAccessToken(res.data.access_token, res.data.expires_in)
          // 保存用户信息到 store
          saveUser({
            uid: res.data.uid,
            email: res.data.email,
            status: 1,
            email_verified_at: null,
            last_login_at: null,
            created_at: res.data.created_at,
          })
          // 跳转到控制台
          router.push('/console/account/basic-information')
        } else if (onSuccess) {
          onSuccess()
        } else {
          router.push('/login?registered=true')
        }
      } else {
        setError(res.message || tErrors('registerFailed'))
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || tErrors('registerFailedRetry'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      <RegisterError error={error} />

      <div>
        <label htmlFor="invitationCode" className="block text-sm font-medium text-gray-700 mb-2">{t('invitationCode')}</label>
        <input
          id="invitationCode"
          name="invitationCode"
          type="text"
          required
          value={form.invitationCode}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          placeholder={t('invitationCodePlaceholder')}
        />
        <p className="mt-1 text-xs text-gray-500">{t('invitationOnlyTip')}</p>
      </div>

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
          <CodeCountdown onSendCode={handleSendCode} disabled={codeLoading} />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">{t('password')}</label>
        <PasswordInput
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder={t('passwordPlaceholder')}
          required
          minLength={8}
        />
        <PasswordStrength password={form.password} />
        <PasswordRequirements password={form.password} />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">{t('confirmPassword')}</label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder={t('confirmPasswordPlaceholder')}
          required
        />
      </div>

      <AgreementLinks checked={form.agreement} onChange={(checked) => {
        setForm(prev => ({ ...prev, agreement: checked }))
        setError('')
      }} />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}
