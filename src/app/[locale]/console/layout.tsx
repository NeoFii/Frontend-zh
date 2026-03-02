'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from '@/i18n/routing'
import ConsoleHeader from '@/components/console/ConsoleHeader'
import ConsoleSidebar from '@/components/console/ConsoleSidebar'
import { useAuthStore } from '@/stores/auth'

// 统一的菜单路径映射常量
export const MENU_PATH_MAP: Record<string, string> = {
  'basic-information': '/console/account/basic-information',
  'interface-key': '/console/account/interface-key',
  'request-limits': '/console/account/request-limits',
  'child-account': '/console/account/child-account',
  'get-api': '/console/api/get-api',
  'third-party-api': '/console/api/third-party-api',
  'usage-record': '/console/usage/record',
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
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const hydrated = useAuthStore(state => state.hydrated)
  const [loading, setLoading] = useState(true)

  // 等待状态从 localStorage 恢复完成
  useEffect(() => {
    if (!hydrated) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setLoading(false)
  }, [isAuthenticated, hydrated, router])

  // 根据当前路径确定活动菜单
  const getActiveMenuFromPath = (path: string): string => {
    return PATH_MENU_MAP[path] || 'basic-information'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ConsoleHeader />
        <ConsoleSidebar activeMenu="basic-information" onMenuChange={() => {}} />
        <main className="ml-64 pt-16 min-h-screen">
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
      <main className="ml-64 pt-16 min-h-screen">
        <div className="w-full p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
