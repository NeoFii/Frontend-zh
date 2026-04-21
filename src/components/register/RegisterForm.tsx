/**
 * 注册表单组件
 * 处理注册逻辑和表单输入
 */

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { PasswordStrength } from './PasswordStrength'
import { PasswordRequirements } from './PasswordRequirements'
import { AgreementLinks } from './AgreementLinks'
import { FormAlert } from '@/components/ui/FormAlert'
import { CodeCountdown } from '@/components/ui/CodeCountdown'
import { useAuthStore } from '@/stores/auth'
import { setAccessToken } from '@/lib/token'
import { sendVerificationCode, register } from '@/lib/api/auth'
import { validateEmail, validatePassword } from '@/lib/utils/validation'
import { PasswordInput } from '@/components/ui/PasswordInput'

type ApiError = {
  response?: {
    data?: {
      message?: string
    }
  }
}

type FormData = {
  invitationCode: string
  email: string
  code: string
  password: string
  confirmPassword: string
  agreement: boolean
}

const getApiErrorMessage = (error: unknown) => (error as ApiError).response?.data?.message

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const { t } = useTranslation('auth.register')
  const { t: tValidation } = useTranslation('auth.validation')
  const { t: tErrors } = useTranslation('auth.errors')
  const { t: tLogin } = useTranslation('auth.login')
  const { login: saveUser } = useAuthStore()

  const [loading, setLoading] = useState(false)
  const [codeLoading, setCodeLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    invitationCode: '',
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
    agreement: false,
  })

  const inputClass = 'h-11 w-full rounded-md border border-[#e5e7eb] bg-white px-3.5 text-sm text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#f97316] focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)]'
  const labelClass = 'mb-1.5 block font-mono text-xs uppercase tracking-[0.06em] text-[#6b7280]'

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
      setError(getApiErrorMessage(err) || tErrors('sendFailed'))
    } finally {
      setCodeLoading(false)
    }
  }

  const validateForm = (): boolean => {
    if (!form.invitationCode.trim()) {
      setError(tValidation('enterInvitationCode'))
      return false
    }

    if (!form.email) {
      setError(tValidation('enterEmail'))
      return false
    }

    if (!validateEmail(form.email)) {
      setError(tValidation('invalidEmail'))
      return false
    }

    if (!form.code) {
      setError(tValidation('enterCode'))
      return false
    }

    if (!form.password || !form.confirmPassword) {
      setError(tValidation('enterPassword'))
      return false
    }

    if (form.password !== form.confirmPassword) {
      setError(tValidation('passwordMismatch'))
      return false
    }

    if (!validatePassword(form.password)) {
      setError(tValidation('passwordComplexity'))
      return false
    }

    if (!form.agreement) {
      setError(tValidation('agreeToTerms'))
      return false
    }

    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const res = await register({
        invitation_code: form.invitationCode.trim(),
        email: form.email,
        verification_code: form.code,
        password: form.password,
        confirm_password: form.confirmPassword,
      })

      if (res.code === 201) {
        if (res.data.access_token && res.data.expires_in) {
          setAccessToken(res.data.access_token, res.data.expires_in)
          saveUser({
            uid: res.data.uid,
            email: res.data.email,
            status: 1,
            email_verified_at: null,
            last_login_at: null,
            created_at: res.data.created_at,
          })
          router.push('/console/account/basic-information')
        } else if (onSuccess) {
          onSuccess()
        }
      } else {
        setError(res.message || tErrors('registerFailed'))
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err) || tErrors('registerFailedRetry'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="mb-2 text-[28px] font-semibold tracking-[-0.015em] text-[#111827]">创建账户</h1>
        <p className="m-0 text-sm text-[#6b7280]">使用邀请码开通你的 TierFlow 控制台。</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <FormAlert error={error} />

        <div>
          <label htmlFor="invitationCode" className={labelClass}>
            {t('invitationCode') || '邀请码'}
          </label>
          <input
            id="invitationCode"
            name="invitationCode"
            type="text"
            required
            value={form.invitationCode}
            onChange={handleChange}
            className={inputClass}
            placeholder={t('invitationCodePlaceholder') || '请输入邀请码'}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            {t('email') || '邮箱'}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder={t('emailPlaceholder') || '请输入邮箱'}
          />
        </div>

        <div>
          <label htmlFor="code" className={labelClass}>
            {t('code') || '验证码'}
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
              placeholder={t('codePlaceholder') || '请输入验证码'}
            />
            <CodeCountdown
              onSendCode={handleSendCode}
              disabled={codeLoading}
              sendingText={tLogin('sending')}
              getCodeText={tLogin('getCode')}
              className="h-11 shrink-0 whitespace-nowrap rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-4 font-mono text-xs text-[#374151] transition hover:border-[#d1d5db] hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            {t('password') || '密码'}
          </label>
          <PasswordInput
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t('passwordPlaceholder') || '请设置密码（至少8位，含大小写字母、数字和特殊符号）'}
            required
            minLength={8}
            className={`${inputClass} pr-12`}
          />
          <PasswordStrength password={form.password} />
          <PasswordRequirements password={form.password} />
        </div>

        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            {t('confirmPassword') || '确认密码'}
          </label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder={t('confirmPasswordPlaceholder') || '请再次输入密码'}
            required
            className={`${inputClass} pr-12`}
          />
        </div>

        <AgreementLinks
          checked={form.agreement}
          onChange={(checked) => {
            setForm(prev => ({ ...prev, agreement: checked }))
            setError('')
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-[46px] w-full rounded-md bg-[#111827] text-sm font-medium text-white transition hover:-translate-y-px hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {loading ? t('submitting') : (t('submit') || '立即注册')}
        </button>
      </form>

      <p className="mt-8 text-center text-[13px] leading-7 text-[#6b7280]">
        {t('hasAccount') || '已有账号？'}
        <Link href="/login" className="text-[#111827] underline decoration-[#d1d5db] underline-offset-4 transition hover:decoration-[#f97316]">
          {t('loginNow') || '立即登录'}
        </Link>
      </p>
    </div>
  )
}
