'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { sendResetPasswordCode, resetPassword } from '@/lib/api/auth'

export default function ForgotPassword() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [codeLoading, setCodeLoading] = useState(false)
  const [codeCountdown, setCodeCountdown] = useState(0)
  const [step, setStep] = useState(1) // 1: 输入邮箱, 2: 输入验证码和新密码

  const [form, setForm] = useState({
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  // 验证码倒计时
  useEffect(() => {
    if (codeCountdown <= 0) return

    const timer = setInterval(() => {
      setCodeCountdown(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [codeCountdown])

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email) {
      setError('请先输入邮箱')
      return
    }

    // 简单验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setCodeLoading(true)
    setError('')

    try {
      const res = await sendResetPasswordCode(form.email)
      if (res.code === 200) {
        setCodeCountdown(60)
        setStep(2)
      } else {
        setError(res.message || '发送失败')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || '发送失败，请稍后重试')
    } finally {
      setCodeLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.code) {
      setError('请填写验证码')
      return
    }
    if (!form.password) {
      setError('请填写新密码')
      return
    }
    if (form.password.length < 8) {
      setError('密码长度至少为8位')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setLoading(true)
    try {
      const res = await resetPassword({
        email: form.email,
        code: form.code,
        new_password: form.password,
      })

      if (res.code === 200) {
        // 重置成功，跳转到登录页
        router.push('/login?reset=true')
      } else {
        setError(res.message || '重置失败')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || '重置失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"></div>
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 flex flex-col justify-center px-16 w-full">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            When you call AI,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">you call us.</span>
          </h1>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? '忘记密码' : '重置密码'}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {step === 1 ? '请输入您注册时使用的邮箱' : '请输入邮箱收到的验证码和新密码'}
            </p>
          </div>

          <form onSubmit={(e) => step === 1 ? sendCode(e) : handleResetPassword(e)} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                disabled={step === 2}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="请输入邮箱"
              />
            </div>

            {step === 2 && (
              <>
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
                    <button
                      type="button"
                      onClick={sendCode}
                      disabled={codeCountdown > 0 || codeLoading}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {codeLoading ? '发送中...' : codeCountdown > 0 ? `${codeCountdown}s` : '重新发送'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    placeholder="请设置新密码（至少8位）"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    placeholder="请再次输入新密码"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading || codeLoading}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '处理中...' : step === 1 ? '发送验证码' : '重置密码'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">想起密码了？</span>
            <Link href="/login" className="text-gray-900 font-medium hover:text-gray-700 ml-1">
              立即登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
