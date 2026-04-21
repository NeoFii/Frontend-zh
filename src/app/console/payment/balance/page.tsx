'use client'

import { useRouter } from 'next/navigation'
import { useRouterKeys } from '@/hooks/useRouterKeys'
import { useRouterBalance, useRouterUsageEvents, useRouterUsageSummary } from '@/hooks/useRouterUsage'
import {
  calculateMonthlySpend,
  calculateSuccessRate,
  countActiveKeys,
  extractCurrency,
  formatCompactNumber,
  formatCurrency,
  summarizeUsageEvents,
  usageSummaryToAggregate,
} from '@/lib/router-analytics'

function StatCard(props: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
      <p className="text-sm text-gray-500">{props.label}</p>
      <p className="mt-3 text-2xl tracking-tight text-gray-950">{props.value}</p>
      <p className="mt-2 text-xs leading-6 text-gray-400">{props.hint}</p>
    </div>
  )
}

export default function BalancePage() {
  const router = useRouter()
  const { keys, isLoading: keysLoading } = useRouterKeys()
  const { balance, isLoading: balanceLoading } = useRouterBalance()
  const { summary, isLoading: summaryLoading } = useRouterUsageSummary()
  const { events, isLoading: eventsLoading } = useRouterUsageEvents({ limit: 200, maxPages: 10 })

  const currency = extractCurrency(summary, events)
  const aggregate = events.length > 0 ? summarizeUsageEvents(events, currency) : usageSummaryToAggregate(summary)
  const monthlySpend = calculateMonthlySpend(events)
  const successRate = calculateSuccessRate(aggregate)
  const activeKeys = countActiveKeys(keys)
  const loading = keysLoading || balanceLoading || summaryLoading || eventsLoading

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <section className="overflow-hidden rounded-[32px] border border-gray-200 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_32%),linear-gradient(145deg,#ffffff_0%,#f8fafc_100%)] p-8 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.22)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-gray-950 px-3 py-1 text-xs font-medium tracking-[0.24em] text-white">
              BALANCE
            </div>
            <h2 className="mt-5 text-[1.75rem] tracking-tight text-gray-950">账户余额与消费结构</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              这里汇总 prepaid Key 余额、累计消耗和真实 Router 调用成本结构，作为支付与账务页的入口。
            </p>
            <div className="mt-6 text-4xl tracking-tight text-gray-950">
              {loading ? '...' : formatCurrency(balance?.available_balance ?? 0, balance?.currency ?? currency)}
            </div>
            <p className="mt-3 text-sm text-gray-500">
              账户总余额 {loading ? '...' : formatCurrency(balance?.balance ?? 0, balance?.currency ?? currency)}
              ，冻结 {loading ? '...' : formatCurrency(balance?.frozen_amount ?? 0, balance?.currency ?? currency)}。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/console/api/get-api')}
              className="rounded-full bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              管理 API Key
            </button>
            <button
              onClick={() => router.push('/console/payment/billing-history')}
              className="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              查看账单历史
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="本月累计花费" value={loading ? '...' : formatCurrency(monthlySpend, currency)} hint="按当前月真实 usage event 聚合" />
        <StatCard label="总请求数" value={loading ? '...' : formatCompactNumber(aggregate.totalRequests)} hint="成功与失败请求总和" />
        <StatCard label="成功率" value={loading ? '...' : `${successRate.toFixed(1)}%`} hint="当前 Router 请求成功率" />
        <StatCard label="启用中的 Key" value={loading ? '...' : String(activeKeys)} hint="仍可用于调用的 API Key 数量" />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[30px] border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg text-gray-900">Key 余额分布</h3>
            <span className="text-sm text-gray-400">{keys.length} 个 Key</span>
          </div>
          {keys.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-gray-500">
              还没有可展示的 Router Key。
            </div>
          ) : (
            <div className="space-y-3">
              {[...keys].sort((left, right) => left.id - right.id).map((item) => (
                <div key={item.id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm text-gray-900">{item.name}</p>
                        <span className={`rounded-full px-2.5 py-1 text-xs ${item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                          {item.is_active ? '启用中' : '已失效'}
                        </span>
                        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs text-orange-700">{item.billing_mode}</span>
                      </div>
                      <p className="mt-2 text-xs text-gray-400">{item.token_preview}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                        {item.billing_mode === 'limited' ? '剩余额度' : '配额模式'}
                      </p>
                      <p className="mt-2 text-lg text-gray-950">
                        {item.billing_mode === 'limited'
                          ? formatCurrency(item.balance ?? 0, currency)
                          : '不限额'}
                      </p>
                      {item.billing_mode === 'limited' ? (
                        <p className="mt-1 text-xs text-gray-400">
                          已用 {formatCurrency(item.quota_used, currency)} / {formatCurrency(item.quota_limit, currency)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[30px] border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <h3 className="text-lg text-gray-900">消费概览</h3>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">输入 Tokens</dt>
              <dd className="text-gray-900">{loading ? '...' : formatCompactNumber(aggregate.promptTokens)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">输出 Tokens</dt>
              <dd className="text-gray-900">{loading ? '...' : formatCompactNumber(aggregate.completionTokens)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">总 Tokens</dt>
              <dd className="text-gray-900">{loading ? '...' : formatCompactNumber(aggregate.totalTokens)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">总费用</dt>
              <dd className="text-gray-900">{loading ? '...' : formatCurrency(balance?.used_amount ?? aggregate.totalCost, balance?.currency ?? currency)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">结算币种</dt>
              <dd className="text-gray-900">{currency}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
