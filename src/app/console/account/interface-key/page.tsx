'use client'

export default function InterfaceKeyPage() {
  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-normal text-gray-900">接口密钥</h2>
          <p className="text-sm text-gray-500 mt-1">管理您的 API Keys</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-normal rounded-lg transition-colors">
          创建新 Key
        </button>
      </div>

      <div className="space-y-4">
        {[
          { name: '默认 Key', key: 'sk-xxxxx...xxxxxxxx', created: '2026-01-15', lastUsed: '2026-02-23' },
          { name: '测试环境', key: 'sk-yyyyy...yyyyyyyy', created: '2026-02-01', lastUsed: '2026-02-20' },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
            <div>
              <p className="font-normal text-gray-900">{item.name}</p>
              <code className="text-sm text-gray-500" style={{ fontFamily: 'MiSans, sans-serif' }}>{item.key}</code>
              <p className="text-xs text-gray-400 mt-1">创建于 {item.created} · 最后使用 {item.lastUsed}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                复制
              </button>
              <button className="px-3 py-1.5 text-sm text-red-600 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors">
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
