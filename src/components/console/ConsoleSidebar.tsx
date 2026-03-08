'use client'

import { useState, ReactNode } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

interface MenuItem {
  id: string
  name: string
}

interface MenuGroup {
  id: string
  name: string
  icon: ReactNode
  items: MenuItem[]
  isDirect?: boolean // 是否直接跳转（无二级菜单）
}

interface ConsoleSidebarProps {
  activeMenu: string
  onMenuChange: (menu: string) => void
}

// 菜单组图标组件
const AccountIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const FinanceIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ApiIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const UsageIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

export default function ConsoleSidebar({ activeMenu, onMenuChange }: ConsoleSidebarProps) {
  const { t } = useTranslation('console.menu')
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['account', 'api'])

  const menuGroups: MenuGroup[] = [
    {
      id: 'usage',
      name: t('usage'),
      icon: <UsageIcon />,
      isDirect: true,
      items: [
        { id: 'usage-record', name: t('usageRecord') },
      ],
    },
    {
      id: 'api',
      name: t('api'),
      icon: <ApiIcon />,
      items: [
        { id: 'get-api', name: t('getApi') },
        { id: 'third-party-api', name: t('thirdPartyApi') },
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
    {
      id: 'account',
      name: t('account'),
      icon: <AccountIcon />,
      items: [
        { id: 'basic-information', name: t('accountInfo') },
        { id: 'request-limits', name: t('requestLimits') },
        { id: 'child-account', name: t('childAccount') },
      ],
    },
  ]

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  return (
    <aside
      className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 overflow-y-auto"
      style={{ fontFamily: 'MiSans, sans-serif' }}
    >
      <div className="py-2">
        {menuGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.id)
          const hasActiveItem = group.items.some(item => item.id === activeMenu)
          const isDirect = group.isDirect

          // 直接跳转的菜单处理
          const handleClick = () => {
            if (isDirect) {
              // 直接跳转到第一个菜单项
              onMenuChange(group.items[0].id)
            } else {
              toggleGroup(group.id)
            }
          }

          return (
            <div key={group.id} className="mb-1">
              {/* 菜单组标题 - 一级导航 */}
              <button
                onClick={handleClick}
                className="w-full flex items-center justify-between px-4 py-2.5 transition-colors duration-200"
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '19px',
                  color: hasActiveItem ? '#181E25' : '#5F5F5F',
                }}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className="transition-colors duration-200"
                    style={{ color: hasActiveItem ? '#181E25' : '#5F5F5F' }}
                  >
                    {group.icon}
                  </span>
                  <span>{group.name}</span>
                </div>
                {/* 直接跳转的菜单不显示箭头 */}
                {!isDirect && (
                  <svg
                    className="w-4 h-4 transition-all duration-200"
                    style={{ color: '#5F5F5F', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {/* 展开的子菜单 - 二级导航 */}
              {isExpanded && !isDirect && (
                <div className="py-1">
                  {group.items.map((item) => {
                    const isActive = activeMenu === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => onMenuChange(item.id)}
                        className="relative w-full text-left pl-12 pr-4 py-2 transition-all duration-200"
                        style={{
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '19px',
                          color: isActive ? '#f97316' : '#5F5F5F',
                          backgroundColor: isActive ? 'rgba(249, 115, 22, 0.06)' : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color = '#181E25'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color = '#5F5F5F'
                          }
                        }}
                      >
                        <div className="flex items-center">
                          {/* 选中指示器 - 小圆点 */}
                          {isActive && (
                            <span className="absolute left-8 w-1.5 h-1.5 rounded-full bg-primary-500" />
                          )}
                          <span>{item.name}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 底部版权信息 */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-gray-100">
        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>2026 © Eucal AI</p>
      </div>
    </aside>
  )
}
