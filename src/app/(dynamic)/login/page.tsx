'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loginType, setLoginType] = useState<'password' | 'code'>('password')
  const [codeCountdown, setCodeCountdown] = useState(0)

  const [form, setForm] = useState({
    email: '',
    password: '',
    code: '',
    agreement: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // 验证码倒计时
  useEffect(() => {
    if (codeCountdown <= 0) return

    const timer = setInterval(() => {
      setCodeCountdown(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [codeCountdown])

  const sendCode = async () => {
    if (!form.email) {
      alert('请先输入邮箱')
      return
    }

    setCodeCountdown(60)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.agreement) {
      alert('请阅读并同意用户协议和隐私政策')
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/')
    } catch (error) {
      console.error('登录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* 左侧 - 品牌展示区域 */}
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

      {/* 右侧 - 登录表单区域 */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Eucal AI | 登录</h2>
          </div>

          {/* 登录方式切换 */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setLoginType('password')}
              className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
                loginType === 'password' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              密码登录
              {loginType === 'password' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>}
            </button>
            <button
              onClick={() => setLoginType('code')}
              className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
                loginType === 'code' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              邮箱验证码登录
              {loginType === 'code' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>}
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
                  <button
                    type="button"
                    onClick={sendCode}
                    disabled={codeCountdown > 0}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码'}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <input
                id="agreement"
                name="agreement"
                type="checkbox"
                required
                checked={form.agreement}
                onChange={handleChange}
                className="h-4 w-4 mt-1 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <label htmlFor="agreement" className="ml-2 text-sm text-gray-600">
                我已阅读并同意
                <a href="#" className="text-gray-900 underline hover:text-gray-700">用户协议</a>
                和
                <a href="#" className="text-gray-900 underline hover:text-gray-700">隐私政策</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '立即登录'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-700">忘记密码？</a>
            <Link href="/register" className="text-gray-900 font-medium hover:text-gray-700">
              还没有账号？立即注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
