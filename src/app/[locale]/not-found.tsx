'use client'

import { Link } from '@/i18n/routing'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="text-center px-4">
        <div className="text-9xl font-bold text-gray-900 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">页面不存在</h1>
        <p className="text-xl text-gray-600 mb-8">抱歉，您访问的页面不存在或已被移除</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            返回首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            返回上一页
          </button>
        </div>
      </div>
    </div>
  )
}
