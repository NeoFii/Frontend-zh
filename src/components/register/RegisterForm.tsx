/**
 * 注册表单组件
 * 处理注册逻辑和表单输入
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PasswordStrength } from './PasswordStrength'
import { AgreementLinks } from './AgreementLinks'
import { RegisterError } from './RegisterError'
import { CodeCountdown } from './CodeCountdown'
import { useAuthStore } from '@/stores/auth'
import { setAccessToken, setRefreshToken } from '@/lib/token'
import { sendVerificationCode, register } from '@/lib/api/auth'

interface RegisterFormProps {
  onSuccess?: () => void
}

interface FormData {
  email: string
  code: string
  password: string
  confirmPassword: string
  agreement: boolean
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter()
  const { login: saveUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [codeLoading, setCodeLoading] = useState(false)

  const [form, setForm] = useState<FormData>({
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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
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
        setError(res.message || '发送失败')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || '发送失败，请稍后重试')
    } finally {
      setCodeLoading(false)
    }
  }

  const validateForm = (): boolean => {
    if (!form.agreement) {
      setError('请阅读并同意用户协议和隐私政策')
      return false
    }
    if (!form.email || !form.code || !form.password || !form.confirmPassword) {
      setError('请填写所有必填项')
      return false
    }
    if (form.password !== form.confirmPassword) {
      setError('两次输入的密码不一致')
      return false
    }
    if (form.password.length < 8) {
      setError('密码长度至少为8位')
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
        email: form.email,
        verification_code: form.code,
        password: form.password,
        confirm_password: form.confirmPassword,
      })

      if (res.code === 201) {
        // 检查是否有 Token（注册成功后自动登录）
        if (res.data.access_token && res.data.refresh_token && res.data.expires_in) {
          // 存储 Token
          setAccessToken(res.data.access_token, res.data.expires_in)
          setRefreshToken(res.data.refresh_token)
          // 保存用户信息到 store
          saveUser({
            uid: res.data.uid,
            email: res.data.email,
            nickname: res.data.nickname,
            avatar_url: null,
          })
          // 跳转到控制台
          router.push('/console/account/basic-information')
        } else if (onSuccess) {
          onSuccess()
        } else {
          router.push('/login?registered=true')
        }
      } else {
        setError(res.message || '注册失败')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || '注册失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      <RegisterError error={error} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          placeholder="请输入邮箱"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">验证码</label>
        <div className="flex space-x-3">
          <input
            name="code"
            type="text"
            required
            maxLength={6}
            value={form.code}
            onChange={handleChange}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            placeholder="请输入验证码"
          />
          <CodeCountdown onSendCode={handleSendCode} disabled={codeLoading} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          placeholder="请设置密码（至少8位）"
        />
        <PasswordStrength password={form.password} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">确认密码</label>
        <input
          name="confirmPassword"
          type="password"
          required
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          placeholder="请再次输入密码"
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
        {loading ? '注册中...' : '立即注册'}
      </button>
    </form>
  )
}
