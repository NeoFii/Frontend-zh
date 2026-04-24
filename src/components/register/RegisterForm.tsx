/**
 * 注册表单组件
 * 处理注册逻辑和表单输入
 */

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { extractErrorMessage, normalizeResponseMessage } from '@/lib/error'

type FormData = {
  email: string
  code: string
  password: string
  confirmPassword: string
  agreement: boolean
}

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const { login: saveUser } = useAuthStore()

  const [loading, setLoading] = useState(false)
  const [codeLoading, setCodeLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
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
      setError('请先输入邮箱')
      return
    }

    if (!validateEmail(form.email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setCodeLoading(true)
    setError('')

    try {
      const res = await sendVerificationCode(form.email)
      if (res.code !== 200) {
        setError(normalizeResponseMessage(res.message, '发送失败'))
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err))
    } finally {
      setCodeLoading(false)
    }
  }

  const validateForm = (): boolean => {
    if (!form.email) {
      setError('请先输入邮箱')
      return false
    }

    if (!validateEmail(form.email)) {
      setError('请输入有效的邮箱地址')
      return false
    }

    if (!form.code) {
      setError('请填写验证码')
      return false
    }

    if (!form.password || !form.confirmPassword) {
      setError('请填写密码')
      return false
    }

    if (form.password !== form.confirmPassword) {
      setError('两次输入的密码不一致')
      return false
    }

    if (!validatePassword(form.password)) {
      setError('密码需包含大写字母、小写字母、数字和特殊符号，且不少于8位')
      return false
    }

    if (!form.agreement) {
      setError('请阅读并同意用户协议和隐私政策')
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
        email: form.email,
        verification_code: form.code,
        password: form.password,
        confirm_password: form.confirmPassword,
        lang: 'zh',
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
        setError(normalizeResponseMessage(res.message, '注册失败'))
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="mb-2 text-[28px] font-semibold tracking-[-0.015em] text-[#111827]">创建账户</h1>
        <p className="m-0 text-sm text-[#6b7280]">通过邮箱注册你的 TierFlow 控制台。</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <FormAlert error={error} />

        <div>
          <label htmlFor="email" className={labelClass}>
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

        <div>
          <label htmlFor="code" className={labelClass}>
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
              disabled={codeLoading}
              sendingText={'发送中...'}
              getCodeText={'获取验证码'}
              className="h-11 shrink-0 whitespace-nowrap rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-4 font-mono text-xs text-[#374151] transition hover:border-[#d1d5db] hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            {'密码'}
          </label>
          <PasswordInput
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={'请设置密码（至少8位，含大小写字母、数字和特殊符号）'}
            required
            minLength={8}
            className={`${inputClass} pr-12`}
          />
          <PasswordStrength password={form.password} />
          <PasswordRequirements password={form.password} />
        </div>

        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            {'确认密码'}
          </label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder={'请再次输入密码'}
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
          {loading ? '注册中...' : '立即注册'}
        </button>
      </form>

      <p className="mt-8 text-center text-[13px] leading-7 text-[#6b7280]">
        {'已有账号？'}
        <Link href="/login" className="text-[#111827] underline decoration-[#d1d5db] underline-offset-4 transition hover:decoration-[#f97316]">
          {'立即登录'}
        </Link>
      </p>
    </div>
  )
}
