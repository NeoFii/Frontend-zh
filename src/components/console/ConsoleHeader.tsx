'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { useTranslation } from '@/hooks/useTranslation'

export default function ConsoleHeader() {
  const { t } = useTranslation('console.header')
  // 使用选择器精确订阅，避免不必要的重渲染
  const user = useAuthStore(state => state.user)
  const logoutAsync = useAuthStore(state => state.logoutAsync)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 延迟关闭下拉菜单
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false)
    }, 300)
  }

  // 取消延迟关闭
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logoutAsync()
      window.location.href = '/login'
    } catch (error) {
      console.error('[Logout] ERROR:', error)
    }
  }

  // 获取用户头像显示内容
  const getUserDisplay = () => {
    if (user?.email) {
      // 提取 @ 前的部分
      const localPart = user.email.split('@')[0]
      // 如果是英文字母，返回大写首字母
      if (/^[a-zA-Z]/.test(localPart)) {
        return localPart.charAt(0).toUpperCase()
      }
      // 如果是中文或其他字符，返回第一个字符
      return localPart.charAt(0)
    }
    return 'U'
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Eucal AI</span>
          </Link>
        </div>

        {/* 中间占位 - 左侧边栏区域 */}
        <div className="flex-1"></div>

        {/* 右侧导航 */}
        <div className="flex items-center space-x-8">
          <a
            href="https://neofii.github.io/TierFlow-Doc/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] text-gray-600 hover:text-gray-900 transition-colors font-normal"
          >
            {t('docs')}
          </a>
          <Link href="/console/account/basic-information" className="text-[15px] text-gray-900 font-normal">
            {t('account')}
          </Link>

          {/* 通知图标 */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* 用户头像下拉菜单 */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => {
              handleMouseEnter()
              setShowDropdown(true)
            }}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-200 transition-colors"
            >
              <span className="text-primary-600 text-sm font-medium">{getUserDisplay()}</span>
            </button>

            {/* 下拉菜单 */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-fade-in">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
