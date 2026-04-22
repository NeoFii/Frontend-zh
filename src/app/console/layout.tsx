'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import ConsoleHeader from '@/components/console/ConsoleHeader'
import ConsoleSidebar from '@/components/console/ConsoleSidebar'
import { useUser } from '@/hooks/useUser'
import { useAuthStore } from '@/stores/auth'

// 统一的菜单路径映射常量
export const MENU_PATH_MAP: Record<string, string> = {
  'usage-record': '/console/usage/record',
  'get-api': '/console/api/get-api',
  'balance': '/console/payment/balance',
  'recharge': '/console/payment/recharge',
  'voucher': '/console/payment/voucher',
  'billing-history': '/console/payment/billing-history',
}

// 路径到菜单ID的反向映射
export const PATH_MENU_MAP: Record<string, string> = Object.entries(MENU_PATH_MAP).reduce(
  (acc, [menu, path]) => {
    acc[path] = menu
    return acc
  },
  {} as Record<string, string>
)

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  // 使用选择器精确订阅
  const sessionStatus = useAuthStore((state) => state.sessionStatus)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const { isError, mutate } = useUser({ enabled: true, restoreSession: true })

  // 等待状态从 localStorage 恢复完成
  useEffect(() => {
    if (!isHydrated) {
      return
    }

    if (sessionStatus === 'anonymous') {
      router.push('/login')
    }
  }, [isHydrated, router, sessionStatus])

  // 根据当前路径确定活动菜单
  const getActiveMenuFromPath = (path: string): string => {
    // 剥离语言前缀（如 /zh/console/... -> /console/...）
    const pathWithoutLocale = path.replace(/^\/(zh|en)\//, '/')
    return PATH_MENU_MAP[pathWithoutLocale] || ''
  }

  const [activeMenu, setActiveMenu] = useState(() => getActiveMenuFromPath(pathname))

  // 当路径变化时更新活动菜单
  useEffect(() => {
    setActiveMenu(getActiveMenuFromPath(pathname))
  }, [pathname])

  // 处理菜单切换
  const handleMenuChange = (menu: string) => {
    const path = MENU_PATH_MAP[menu]
    if (path) {
      router.push(path)
    }
  }

  if (isError && sessionStatus !== 'authenticated') {
    return (
      <div className="min-h-screen bg-gray-50">
        <ConsoleHeader />
        <ConsoleSidebar activeMenu="usage-record" onMenuChange={() => {}} />
        <main className="ml-72 pt-16 min-h-screen">
          <div className="w-full p-8">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              当前会话校验失败。
              <button onClick={() => mutate()} className="ml-2 font-medium text-red-700 hover:text-red-900">
                重试
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ConsoleHeader />
        <ConsoleSidebar activeMenu="usage-record" onMenuChange={() => {}} />
        <main className="ml-72 pt-16 min-h-screen">
          <div className="w-full p-8">
            {/* 骨架屏效果，减少感知延迟 */}
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
              <div className="space-y-4">
                <div className="h-20 bg-gray-100 rounded-lg"></div>
                <div className="h-20 bg-gray-100 rounded-lg"></div>
                <div className="h-20 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ConsoleHeader />
      <ConsoleSidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />
      <main className="ml-72 pt-16 min-h-screen">
        <div className="w-full p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
