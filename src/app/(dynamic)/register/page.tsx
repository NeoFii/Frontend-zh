'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/register'
import AuthLayout, { LoadingState } from '@/components/ui/AuthLayout'

function RegisterContent() {
  const router = useRouter()

  const handleRegisterSuccess = () => {
    router.push('/login?registered=true')
  }

  return (
    <AuthLayout
      heading={<>让智能体用<span className="text-[#fb923c]">对的</span>模型<br />而不是贵的</>}
      showFormHeader={false}
      showFooter={false}
      centerAsideContent
    >
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </AuthLayout>
  )
}

export default function Register() {
  return (
    <Suspense fallback={<LoadingState label="加载中..." />}>
      <RegisterContent />
    </Suspense>
  )
}
