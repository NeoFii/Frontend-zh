'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { LegendComponent, TooltipComponent } from 'echarts/components'
import { useRouter } from 'next/navigation'
import { useRouterKeys } from '@/hooks/useRouterKeys'
import { useRouterBalance, useRouterUsageEvents, useRouterUsageSummary } from '@/hooks/useRouterUsage'
import { apiKeyStatusMeta } from '@/lib/api/router'
import ConsolePageHeader from '@/components/ui/ConsolePageHeader'
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

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-950"></div>
    </div>
  ),
})

echarts.use([PieChart, CanvasRenderer, LegendComponent, TooltipComponent])

const CHART_COLORS = ['#0f172a', '#f97316', '#10b981', '#8b5cf6', '#06b6d4', '#ef4444', '#eab308']

export default function BalancePage() {
  const router = useRouter()
  const { keys, isLoading: keysLoading } = useRouterKeys()
  const { balance, isLoading: balanceLoading } = useRouterBalance()
  const { summary, isLoading: summaryLoading } = useRouterUsageSummary()
  const { events, isLoading: eventsLoading } = useRouterUsageEvents({ limit: 100, maxPages: 10 })

  const currency = extractCurrency(summary)
  const aggregate = events.length > 0 ? summarizeUsageEvents(events, currency) : usageSummaryToAggregate(summary)
  const monthlySpend = calculateMonthlySpend(events)
  const successRate = calculateSuccessRate(aggregate)
  const activeKeys = countActiveKeys(keys)
  const loading = keysLoading || balanceLoading || summaryLoading || eventsLoading

  const availableBalance = balance?.available_balance ?? 0
  const totalBalance = balance?.balance ?? 0
  const frozenAmount = balance?.frozen_amount ?? 0
  const balanceCurrency = balance?.currency ?? currency

  const costShareOption = useMemo(() => {
    const limitedKeys = keys.filter((k) => k.billing_mode === 'limited' && k.quota_used > 0)
    const data = limitedKeys.length > 0
      ? limitedKeys.map((k, i) => ({
          value: k.quota_used,
          name: k.name,
          itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
        }))
      : [{ value: 1, name: '暂无数据', itemStyle: { color: '#e5e7eb' } }]

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: { name: string; value: number; percent: number }) =>
          limitedKeys.length > 0
            ? `${params.name}<br/>${formatCurrency(params.value, currency)} (${params.percent}%)`
            : '暂无消费记录',
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        textStyle: { color: '#64748b', fontSize: 12 },
      },
      series: [
        {
          type: 'pie',
          radius: ['48%', '72%'],
          center: ['50%', '45%'],
          label: { show: false },
          data,
        },
      ],
    }
  }, [keys, currency])

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      {/* Hero: Balance overview */}
      <section className="rounded-2xl bg-[#f7f7f8] px-8 py-7 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.2)] ring-1 ring-inset ring-gray-100">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <ConsolePageHeader badge="BALANCE" title="账户余额" description={`总余额 ${loading ? '...' : formatCurrency(totalBalance, balanceCurrency)}，冻结 ${loading ? '...' : formatCurrency(frozenAmount, balanceCurrency)}`} />
            <p className="mt-2 text-5xl font-semibold tracking-tight text-gray-950">
              {loading ? '...' : formatCurrency(availableBalance, balanceCurrency)}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/console/payment/billing-history')}
                className="rounded-full bg-gray-950 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                账单历史
              </button>
              <button
                onClick={() => router.push('/console/payment/recharge')}
                className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                充值记录
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
              <p className="text-sm text-gray-500">本月累计花费</p>
              <p className="mt-2 text-2xl tracking-tight text-gray-950">{loading ? '...' : formatCurrency(monthlySpend, currency)}</p>
              <p className="mt-1 text-xs text-gray-400">按当前月真实 usage event 聚合</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
              <p className="text-sm text-gray-500">总请求数</p>
              <p className="mt-2 text-2xl tracking-tight text-gray-950">{loading ? '...' : formatCompactNumber(aggregate.totalRequests)}</p>
              <p className="mt-1 text-xs text-gray-400">成功与失败请求总和</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
              <p className="text-sm text-gray-500">成功率</p>
              <p className="mt-2 text-2xl tracking-tight text-gray-950">{loading ? '...' : `${successRate.toFixed(1)}%`}</p>
              <p className="mt-1 text-xs text-gray-400">当前 Router 请求成功率</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
              <p className="text-sm text-gray-500">启用中的 Key</p>
              <p className="mt-2 text-2xl tracking-tight text-gray-950">{loading ? '...' : String(activeKeys)}</p>
              <p className="mt-1 text-xs text-gray-400">仍可用于调用的 API Key 数量</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main: Key balances + Cost chart */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg text-gray-900">Key 余额分布</h3>
            <span className="text-sm text-gray-400">{keys.length} 个 Key</span>
          </div>
          {keys.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500">
              还没有可展示的 Router Key。
            </div>
          ) : (
            <div className="space-y-4">
              {[...keys].sort((a, b) => a.id - b.id).map((item) => {
                const statusMeta = apiKeyStatusMeta(item.status)
                const isLimited = item.billing_mode === 'limited'
                const usedPercent = isLimited && item.quota_limit > 0
                  ? Math.min(100, (item.quota_used / item.quota_limit) * 100)
                  : 0

                return (
                  <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${statusMeta.tone}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-gray-400">{item.token_preview}</span>
                    </div>

                    {isLimited ? (
                      <div className="mt-3">
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-gray-950 transition-all"
                            style={{ width: `${usedPercent}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <span>已用 {formatCurrency(item.quota_used, currency)}</span>
                          <span>总额 {formatCurrency(item.quota_limit, currency)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-gray-400">不限额</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
            <h3 className="mb-4 text-lg text-gray-900">消费结构</h3>
            <ReactECharts option={costShareOption} style={{ height: '280px' }} />
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
            <h3 className="text-lg text-gray-900">Token 消耗</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">输入 Tokens</dt>
                <dd className="text-gray-900">{loading ? '...' : formatCompactNumber(aggregate.promptTokens)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">输出 Tokens</dt>
                <dd className="text-gray-900">{loading ? '...' : formatCompactNumber(aggregate.completionTokens)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <dt className="text-gray-500">总 Tokens</dt>
                <dd className="font-medium text-gray-900">{loading ? '...' : formatCompactNumber(aggregate.totalTokens)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">总费用</dt>
                <dd className="font-medium text-gray-900">{loading ? '...' : formatCurrency(aggregate.totalCost, currency)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">结算币种</dt>
                <dd className="text-gray-900">{currency}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}
