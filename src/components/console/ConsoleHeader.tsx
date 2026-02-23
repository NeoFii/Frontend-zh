'use client'

import Link from 'next/link'

export default function ConsoleHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
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
          <Link href="/docs" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            文档中心
          </Link>
          <Link href="/console" className="text-sm text-gray-900 font-medium">
            账户管理
          </Link>
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            订阅套餐
          </Link>

          {/* 通知图标 */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* 用户头像 */}
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-200 transition-colors">
            <span className="text-primary-600 text-sm font-medium">U</span>
          </div>
        </div>
      </div>
    </header>
  )
}
