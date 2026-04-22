'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { LoginForm } from '@/components/login'
import { FormAlert } from '@/components/ui/FormAlert'
import AuthLayout, { LoadingState } from '@/components/ui/AuthLayout'

const AsideTerminal = () => (
  <div className="mt-auto rounded-[10px] border border-white/15 bg-white/[0.08] p-5 font-mono text-[12.5px] leading-7 text-white/70">
    $ tierflow auth login<br />
    <span className="text-[#4ebf89]">✓</span> API key created · <span className="text-[#fb923c]">tf_live_8k2...</span><br />
    <span className="text-[#4ebf89]">✓</span> 账户已充值 <span className="text-[#fb923c]">¥20.00</span> 免费额度<br />
    <span className="text-[#4ebf89]">✓</span> 接下来：查看文档，5 分钟接入
  </div>
)

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
      heading={<>让智能体用<span className="text-[#fb923c]">对的</span>模型，<br />不是用贵的。</>}
      subtitle="加入 TierFlow，每一次 Agent 调用都交给调度器，保证质量的同时平均节省 62% 的 token 成本。注册即送 ¥20 免费额度。"
      terminal={<AsideTerminal />}
      switchLabel="还没有账户？"
      switchLinkText="注册"
      switchHref="/register"
      footerRight="Secure auth"
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
