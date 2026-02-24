'use client'

export default function RechargePage() {
  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }}>
      <h2 className="text-xl font-normal text-gray-900 mb-6">充值记录</h2>
      <div className="divide-y divide-gray-100">
        {[
          { type: '充值', amount: '+¥100.00', date: '2026-02-20', status: '成功' },
          { type: '充值', amount: '+¥200.00', date: '2026-01-15', status: '成功' },
          { type: '充值', amount: '+¥500.00', date: '2026-01-01', status: '成功' },
        ].map((item, index) => (
          <div key={index} className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-normal text-green-600">充</span>
              </div>
              <div>
                <p className="text-sm font-normal text-gray-900">{item.type}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-normal text-green-600">{item.amount}</span>
              <span className="text-sm text-gray-500">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
