'use client'

import { ReactNode } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/stores/auth'

interface MenuItem {
  id: string
  name: string
}

interface MenuGroup {
  id: string
  name: string
  icon: ReactNode
  items: MenuItem[]
}

interface ConsoleSidebarProps {
  activeMenu: string
  onMenuChange: (menu: string) => void
}

const AccountIcon = () => (
  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const ApiIcon = () => (
  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const UsageIcon = () => (
  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 19h16M7 16V8m5 8V5m5 11v-6" />
  </svg>
)

const FinanceIcon = () => (
  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 7h18M6 12h4m-4 4h3m8-8h.01M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
  </svg>
)

const developingItems = new Set(['recharge', 'voucher'])

export default function ConsoleSidebar({ activeMenu, onMenuChange }: ConsoleSidebarProps) {
  const { t } = useTranslation('console.menu')
  const { t: tHeader } = useTranslation('console.header')
  const user = useAuthStore((state) => state.user)
  const logoutAsync = useAuthStore((state) => state.logoutAsync)

  const getUserInitial = () => {
    if (user?.email) {
      const localPart = user.email.split('@')[0]
      return /^[a-zA-Z]/.test(localPart) ? localPart.charAt(0).toUpperCase() : localPart.charAt(0)
    }
    return 'U'
  }

  const handleLogout = async () => {
    try {
      await logoutAsync()
      window.location.href = '/login'
    } catch {
      // best effort
    }
  }

  const menuGroups: MenuGroup[] = [
    {
      id: 'usage',
      name: t('usage'),
      icon: <UsageIcon />,
      items: [{ id: 'usage-record', name: t('usageRecord') }],
    },
    {
      id: 'account',
      name: t('account'),
      icon: <AccountIcon />,
      items: [
        { id: 'basic-information', name: t('accountInfo') },
      ],
    },
    {
      id: 'api',
      name: t('api'),
      icon: <ApiIcon />,
      items: [
        { id: 'get-api', name: t('getApi') },
      ],
    },
    {
      id: 'payment',
      name: t('payment'),
      icon: <FinanceIcon />,
      items: [
        { id: 'balance', name: t('balance') },
        { id: 'recharge', name: t('recharge') },
        { id: 'voucher', name: t('voucher') },
        { id: 'billing-history', name: t('billingHistory') },
      ],
    },
  ]

  return (
    <aside
      className="fixed left-0 top-16 flex h-[calc(100vh-64px)] w-72 flex-col border-r border-gray-200 bg-white"
      style={{ fontFamily: 'MiSans, sans-serif' }}
    >
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <nav className="space-y-6">
          {menuGroups.map((group) => (
            <section key={group.id}>
              <div className="mb-3 flex items-center gap-2 px-2 text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
                <span className="text-gray-500">{group.icon}</span>
                <span>{group.name}</span>
              </div>

              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const isActive = activeMenu === item.id
                  const isDeveloping = developingItems.has(item.id)

                  return (
                    <button
                      key={item.id}
                      onClick={() => onMenuChange(item.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition ${
                        isActive
                          ? 'bg-gray-950 text-white shadow-[0_16px_30px_-18px_rgba(15,23,42,0.55)]'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
                      }`}
                    >
                      <p className="truncate text-[13px] font-medium">{item.name}</p>
                      {isDeveloping ? (
                        <span
                          className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-[0.14em] ${
                            isActive ? 'bg-white/14 text-slate-200' : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          DEV
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-950 text-sm font-medium text-white">
            {getUserInitial()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{user?.email || '当前账户'}</p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Account</p>
          </div>
          <button
            onClick={handleLogout}
            title={tHeader('logout')}
            className="shrink-0 rounded-xl p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
