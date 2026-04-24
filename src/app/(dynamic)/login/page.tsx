'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { LoginForm } from '@/components/login'
import { FormAlert } from '@/components/ui/FormAlert'
import AuthLayout, { LoadingState } from '@/components/ui/AuthLayout'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const sessionStatus = useAuthStore((state) => state.sessionStatus)

  const successMessage = searchParams.get('registered') === 'true'
    ? '注册成功，请登录'
    : searchParams.get('reset') === 'true'
      ? '密码重置成功，请使用新密码登录'
      : ''

  useEffect(() => {
    if (isHydrated && sessionStatus === 'authenticated') {
      router.replace('/console/usage/record')
    }
  }, [isHydrated, router, sessionStatus])

  const handleLoginSuccess = () => {
    window.location.href = '/console/usage/record'
  }

  return (
    <AuthLayout
      heading={<>让智能体用<span className="text-[#fb923c]">对的</span>模型<br />而不是贵的</>}
      showFormHeader={false}
      showFooter={false}
      centerAsideContent
    >
      {successMessage && (
        <div className="mb-5">
          <FormAlert success={successMessage} />
        </div>
      )}
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  )
}

export default function Login() {
  const isHydrated = useAuthStore((state) => state.isHydrated)

  if (!isHydrated) {
    return <LoadingState label="加载中..." />
  }

  return (
    <Suspense fallback={<LoadingState label="加载中..." />}>
      <LoginContent />
    </Suspense>
  )
}
