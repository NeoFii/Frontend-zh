'use client'

export default function RequestLimitsPage() {
  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }}>
      <h2 className="text-xl font-normal text-gray-900 mb-6">请求限制</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-2xl font-normal text-gray-900">100</p>
          <p className="text-sm text-gray-500 mt-1">每分钟请求</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-2xl font-normal text-gray-900">10,000</p>
          <p className="text-sm text-gray-500 mt-1">每日请求</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-2xl font-normal text-gray-900">50万</p>
          <p className="text-sm text-gray-500 mt-1">每月 tokens</p>
        </div>
      </div>
    </div>
  )
}
