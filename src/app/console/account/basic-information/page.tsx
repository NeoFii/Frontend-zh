'use client'

import { useEffect } from 'react'
import { useConsole } from '../../layout'
import { useUser } from '@/hooks/useUser'

export default function BasicInformationPage() {
  const { setUserInfo: setContextUserInfo } = useConsole()
  const { user, isLoading, isError, mutate } = useUser()

  // 同步用户信息到 Context
  useEffect(() => {
    if (user) {
      setContextUserInfo(user)
    }
  }, [user, setContextUserInfo])

  // 加载状态
  if (isLoading) {
    return (
      <div style={{ fontFamily: 'MiSans, sans-serif' }}>
        <div className="animate-pulse">
          {/* 骨架屏 - 基本信息 */}
          <div className="mb-6">
            <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="flex items-center gap-x-32 py-2">
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="border-t border-gray-100 my-6"></div>
          {/* 骨架屏 - 认证信息 */}
          <div className="mb-6">
            <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
          </div>
          <div className="border-t border-gray-100 my-6"></div>
          {/* 骨架屏 - 安全设置 */}
          <div>
            <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-16 bg-gray-100 rounded mb-4"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // 错误状态
  if (isError) {
    return (
      <div style={{ fontFamily: 'MiSans, sans-serif' }}>
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-red-600 text-sm">获取用户信息失败，请稍后重试</span>
            <button
              onClick={() => mutate()}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }}>
      {/* 基本信息 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-normal text-gray-900">基本信息</h2>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-x-32">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">邮箱</span>
              <span className="text-sm text-gray-900 bg-gray-50 px-2 py-0.5 rounded" style={{ fontFamily: 'MiSans, sans-serif' }}>{user?.email || '-'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">UID</span>
              <code className="text-sm text-gray-900 bg-gray-50 px-2 py-0.5 rounded" style={{ fontFamily: 'MiSans, sans-serif' }}>{user?.uid || '-'}</code>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-normal rounded-lg transition-colors">
              获取你的 key
            </button>
            <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-normal rounded-lg transition-colors">
              立即充值
            </button>
          </div>
        </div>
      </div>

      {/* 分割线 */}
      <div className="border-t border-gray-100 my-6"></div>

      {/* 认证信息 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-normal text-gray-900">认证信息</h2>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-gray-500 mb-1">企业认证</p>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
              <span className="text-gray-900">未认证</span>
            </div>
          </div>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-normal">
            去实名认证 →
          </button>
        </div>
      </div>

      {/* 分割线 */}
      <div className="border-t border-gray-100 my-6"></div>

      {/* 安全设置 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-normal text-gray-900">安全设置</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-normal text-gray-900">登录密码</p>
              <p className="text-sm text-gray-500 mt-1">建议您定期更换密码，以保护账户安全</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-normal rounded-lg hover:bg-gray-50 transition-colors">
              修改密码
            </button>
          </div>

          <div className="border-t border-gray-100"></div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-normal text-gray-900">邮箱绑定</p>
              <p className="text-sm text-gray-500 mt-1">您的绑定邮箱：{user?.email || '-'}</p>
            </div>
            <span className="text-sm text-green-600 font-normal flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              已绑定
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
