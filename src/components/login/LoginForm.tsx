/**
 * 登录表单组件
 * 处理登录逻辑和表单输入
 */

import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { setAccessToken, setRefreshToken } from '@/lib/token'
import { LoginTypeSwitcher } from './LoginTypeSwitcher'
import { CodeCountdown } from './CodeCountdown'
import { LoginError } from './LoginError'
import { login, loginWithCode, sendLoginCode } from '@/lib/api/auth'

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

    setError('')
    const res = await sendLoginCode(form.email)
    if (res.code !== 200) {
      setError(res.message || '发送失败')
    }
  }

  const validateForm = (): boolean => {
    if (!form.email) {
      setError('请填写邮箱')
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
        // 存储 Token
        const { access_token, refresh_token, expires_in } = res.data
        setAccessToken(access_token, expires_in)
        setRefreshToken(refresh_token)
        // 保存用户信息到本地 store
        saveUser(res.data.user)
        onSuccess()
      } else {
        // 业务逻辑错误，直接使用后端返回的 message
        setError(res.message || '登录失败')
      }
    } catch (err: unknown) {
      // HTTP 错误，直接使用后端返回的 message
      const axiosError = err as { response?: { data?: { message?: string } } }
      const message = axiosError.response?.data?.message
      setError(message || '登录失败，请稍后重试')
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

        {loginType === 'password' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="请输入密码"
            />
          </div>
        ) : (
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
              <CodeCountdown onSendCode={handleSendCode} />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '登录中...' : '立即登录'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="text-gray-500 hover:text-gray-700">忘记密码？</Link>
        <Link href="/register" className="text-gray-900 font-medium hover:text-gray-700">
          还没有账号？立即注册
        </Link>
      </div>
    </>
  )
}
