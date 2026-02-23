'use client'

import { useState } from 'react'
import ConsoleHeader from '@/components/console/ConsoleHeader'
import ConsoleSidebar from '@/components/console/ConsoleSidebar'

// 账户信息页面
function AccountInfo() {
  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">基本信息</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500 mb-1">邮箱</p>
              <p className="text-gray-900">user@example.com</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500 mb-1">groupID</p>
              <div className="flex items-center space-x-3">
                <code className="text-sm text-gray-900 bg-gray-50 px-3 py-1.5 rounded">group_abc123def456</code>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors">
                获取你的 key
              </button>
              <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors">
                立即充值
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 认证信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">认证信息</h2>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-gray-500 mb-1">企业认证</p>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
              <span className="text-gray-900">未认证</span>
            </div>
          </div>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            去实名认证 →
          </button>
        </div>
      </div>

      {/* 安全设置 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">安全设置</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">登录密码</p>
              <p className="text-sm text-gray-500 mt-1">建议您定期更换密码，以保护账户安全</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              修改密码
            </button>
          </div>

          <div className="border-t border-gray-100"></div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">邮箱绑定</p>
              <p className="text-sm text-gray-500 mt-1">您的绑定邮箱：user@example.com</p>
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center">
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

// API Keys 页面
function ApiKeys() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">接口密钥</h2>
          <p className="text-sm text-gray-500 mt-1">管理您的 API Keys</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors">
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
              <p className="font-medium text-gray-900">{item.name}</p>
              <code className="text-sm text-gray-500">{item.key}</code>
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

// 请求限制页面
function RateLimit() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-6">请求限制</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900">100</p>
          <p className="text-sm text-gray-500 mt-1">每分钟请求</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900">10,000</p>
          <p className="text-sm text-gray-500 mt-1">每日请求</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900">50万</p>
          <p className="text-sm text-gray-500 mt-1">每月 tokens</p>
        </div>
      </div>
    </div>
  )
}

// 子账号页面
function SubAccounts() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-gray-900">子账号管理</h2>
        <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors">
          添加子账号
        </button>
      </div>

      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <p className="text-gray-500">暂无子账号</p>
        <p className="text-sm text-gray-400 mt-1">添加子账号来分配权限</p>
      </div>
    </div>
  )
}

// 余额页面
function Balance() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">账户余额</h2>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold text-gray-900">¥ 128.50</span>
          <span className="text-gray-500">预计可用 30 天</span>
        </div>
        <div className="mt-6 flex space-x-3">
          <button className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors">
            立即充值
          </button>
          <button className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            查看账单
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-2">本月消费</p>
          <p className="text-2xl font-bold text-gray-900">¥ 45.20</p>
          <p className="text-sm text-green-600 mt-2">较上月 +12%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-2">总调用次数</p>
          <p className="text-2xl font-bold text-gray-900">12,345</p>
          <p className="text-sm text-gray-400 mt-2">本月累计</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-2">API 调用成功率</p>
          <p className="text-2xl font-bold text-gray-900">99.9%</p>
          <p className="text-sm text-green-600 mt-2">稳定运行中</p>
        </div>
      </div>
    </div>
  )
}

// 充值记录页面
function RechargeHistory() {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">充值记录</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {[
          { type: '充值', amount: '+¥100.00', date: '2026-02-20', status: '成功' },
          { type: '充值', amount: '+¥200.00', date: '2026-01-15', status: '成功' },
          { type: '充值', amount: '+¥500.00', date: '2026-01-01', status: '成功' },
        ].map((item, index) => (
          <div key={index} className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium text-green-600">充</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.type}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-green-600">{item.amount}</span>
              <span className="text-sm text-gray-500">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 代金券页面
function Voucher() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-6">代金券记录</h2>
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <p className="text-gray-500">暂无代金券</p>
        <p className="text-sm text-gray-400 mt-1">关注活动获取代金券</p>
      </div>
    </div>
  )
}

// 账单页面
function Bill() {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">账单记录</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {[
          { type: '消费', amount: '-¥12.50', date: '2026-02-19' },
          { type: '消费', amount: '-¥8.30', date: '2026-02-18' },
          { type: '消费', amount: '-¥15.20', date: '2026-02-17' },
        ].map((item, index) => (
          <div key={index} className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium text-orange-600">消</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.type}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 套餐管理页面
function CurrentPlan() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">当前套餐</h2>
            <p className="text-sm text-gray-500 mt-1">免费版</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            生效中
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">50万</p>
            <p className="text-sm text-gray-500 mt-1">每月 tokens</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">100</p>
            <p className="text-sm text-gray-500 mt-1">每分钟请求</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-500 mt-1">API Keys</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">7天</p>
            <p className="text-sm text-gray-500 mt-1">日志保留</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors">
          查看所有套餐
        </button>
      </div>
    </div>
  )
}

export default function Console() {
  const [activeMenu, setActiveMenu] = useState('account-info')

  const renderContent = () => {
    switch (activeMenu) {
      case 'account-info':
        return <AccountInfo />
      case 'api-keys':
        return <ApiKeys />
      case 'rate-limit':
        return <RateLimit />
      case 'sub-accounts':
        return <SubAccounts />
      case 'balance':
        return <Balance />
      case 'recharge':
        return <RechargeHistory />
      case 'voucher':
        return <Voucher />
      case 'bill':
        return <Bill />
      case 'current-plan':
        return <CurrentPlan />
      default:
        return <AccountInfo />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <ConsoleHeader />

      {/* 左侧边栏 */}
      <ConsoleSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      {/* 主内容区 */}
      <main className="ml-64 pt-16 min-h-screen">
        <div className="max-w-5xl mx-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
