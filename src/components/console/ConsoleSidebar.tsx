'use client'

import { useState, ReactNode } from 'react'

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

const PlanIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

export default function ConsoleSidebar({ activeMenu, onMenuChange }: ConsoleSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['account'])

  const menuGroups: MenuGroup[] = [
    {
      id: 'account',
      name: '账户管理',
      icon: <AccountIcon />,
      items: [
        { id: 'account-info', name: '账户信息' },
        { id: 'api-keys', name: '接口密钥' },
        { id: 'rate-limit', name: '请求限制' },
        { id: 'sub-accounts', name: '子账号' },
      ],
    },
    {
      id: 'finance',
      name: '财务管理',
      icon: <FinanceIcon />,
      items: [
        { id: 'balance', name: '余额' },
        { id: 'recharge', name: '充值记录' },
        { id: 'voucher', name: '代金券记录' },
        { id: 'bill', name: '账单记录' },
      ],
    },
    {
      id: 'plan',
      name: '套餐管理',
      icon: <PlanIcon />,
      items: [
        { id: 'current-plan', name: 'Coding Plan' },
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
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 overflow-y-auto"
    >
      <div className="py-2">
        {menuGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.id)
          const hasActiveItem = group.items.some(item => item.id === activeMenu)

          return (
            <div key={group.id} className="mb-1">
              {/* 菜单组标题 */}
              <button
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
                  hasActiveItem
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={hasActiveItem ? 'text-primary-600' : 'text-gray-500'}>
                    {group.icon}
                  </span>
                  <span>{group.name}</span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 展开的子菜单 */}
              {isExpanded && (
                <div className="py-1">
                  {group.items.map((item) => {
                    const isActive = activeMenu === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => onMenuChange(item.id)}
                        className={`relative w-full text-left pl-12 pr-4 py-2 text-sm transition-all duration-150 ${
                          isActive
                            ? 'text-primary-600 bg-primary-50/60 font-medium'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
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
        <p className="text-xs text-gray-400">2026 © Eucal AI</p>
      </div>
    </aside>
  )
}
