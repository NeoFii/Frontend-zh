'use client'

export default function BalancePage() {
  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div>
        <h2 className="text-xl font-normal text-gray-900 mb-4">账户余额</h2>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-normal text-gray-900">¥ 128.50</span>
          <span className="text-gray-500">预计可用 30 天</span>
        </div>
        <div className="mt-6 flex space-x-3">
          <button className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-normal rounded-lg transition-colors">
            立即充值
          </button>
          <button className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-normal rounded-lg hover:bg-gray-50 transition-colors">
            查看账单
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-2">本月消费</p>
          <p className="text-2xl font-normal text-gray-900">¥ 45.20</p>
          <p className="text-sm text-green-600 mt-2">较上月 +12%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">总调用次数</p>
          <p className="text-2xl font-normal text-gray-900">12,345</p>
          <p className="text-sm text-gray-400 mt-2">本月累计</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">API 调用成功率</p>
          <p className="text-2xl font-normal text-gray-900">99.9%</p>
          <p className="text-sm text-green-600 mt-2">稳定运行中</p>
        </div>
      </div>
    </div>
  )
}
