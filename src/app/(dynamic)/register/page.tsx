'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/register'
import AuthLayout, { LoadingState } from '@/components/ui/AuthLayout'

const RegisterAsideTerminal = () => (
  <div className="mt-auto rounded-[10px] border border-white/15 bg-white/[0.08] p-5 font-mono text-[12.5px] leading-7 text-white/70">
    $ tierflow auth register<br />
    <span className="text-[#4ebf89]">✓</span> 新账户将获得 <span className="text-[#fb923c]">¥20.00</span> 免费额度<br />
    <span className="text-[#4ebf89]">✓</span> 接下来：创建 API Key，接入智能路由
  </div>
)

function RegisterContent() {
  const router = useRouter()

  const handleRegisterSuccess = () => {
    router.push('/login?registered=true')
  }

  return (
    <AuthLayout
      heading={<>开通 <span className="text-[#fb923c]">TierFlow</span> 账户</>}
      subtitle="将团队成员接入同一套智能路由、账单和 API Key 管理体系。注册完成后即可进入控制台，开始配置模型调用策略。"
      terminal={<RegisterAsideTerminal />}
      switchLabel="已有账户？"
      switchLinkText="登录"
      switchHref="/login"
      footerRight="Secure signup"
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
