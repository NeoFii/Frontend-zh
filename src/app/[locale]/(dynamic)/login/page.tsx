'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/routing'
import { useAuthStore } from '@/stores/auth'
import { useTranslations } from 'next-intl'
import { LoginForm } from '@/components/login'

function LoginContent() {
  const t = useTranslations('auth.login')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, hydrated } = useAuthStore()

  // 解析 URL 参数
  useEffect(() => {
    searchParams.get('registered')
    searchParams.get('reset')
  }, [searchParams])

  // 检查是否已登录（仅在 hydration 完成后）
  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace('/console/usage/record')
    }
  }, [hydrated, isAuthenticated, router])

  const handleLoginSuccess = () => {
    // 登录成功，跳转到控制台使用记录页
    router.push('/console/usage/record')
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
            <h2 className="text-2xl font-bold text-gray-900">{t('pageTitle')}</h2>
          </div>

          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  )
}

// 使用 Suspense 包裹以支持 useSearchParams
export default function Login() {
  const tCommon = useTranslations('common')
  const { hydrated } = useAuthStore()

  // hydration 未完成时显示加载状态
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">{tCommon('loading')}</div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">{tCommon('loading')}</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
