'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import * as echarts from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import type { RouterUsageAnalyticsRange } from '@/lib/api/router'
import {
  useRouterBalance,
  useRouterUsageAnalytics,
  useRouterUsageEvents,
  useRouterUsageLogs,
  useRouterUsageStats,
} from '@/hooks/useRouterUsage'
import { useRouterKeys } from '@/hooks/useRouterKeys'
import ConsolePageHeader from '@/components/ui/ConsolePageHeader'
import ErrorBanner from '@/components/ui/ErrorBanner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'
import { Select } from '@/components/ui/Select'
import { formatCompactNumber, formatCurrency, formatDateTime } from '@/lib/router-analytics'
import {
  buildUsageRecordAnalyticsWindow,
  buildUsageRecordAnalyticsViewModel,
  buildUsageRecordFallbackAnalytics,
  buildUsageRecordFallbackOverview,
  buildUsageRecordTimeWindow,
  normalizeSuccessRateToPercent,
  resolveUsageEventEffectiveModel,
  toUsageRecordQueryValue,
  USAGE_RECORD_RANGES,
} from '@/lib/usage-record-analytics'

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-950"></div>
    </div>
  ),
})

echarts.use([BarChart, PieChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

function SummaryCard(props: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
      <p className="text-sm text-gray-500">{props.label}</p>
      <p className="mt-3 text-3xl tracking-tight text-gray-950">{props.value}</p>
      <p className="mt-2 text-sm text-gray-500">{props.hint}</p>
    </div>
  )
}

function PanelShell(props: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
      <div className="mb-4">
        <h3 className="text-lg text-gray-950">{props.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{props.description}</p>
      </div>
      {props.children}
    </section>
  )
}

function PanelEmptyState(props: { title: string }) {
  return (
    <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 text-center text-sm text-gray-500">
      {props.title}
    </div>
  )
}

function PanelLoadingState() {
  return <div className="h-[320px] animate-pulse rounded-2xl bg-gray-100" />
}

function isSuccessStatus(status: number) {
  return status === 1 || status === 200
}

export default function UsageRecordPage() {
  const initialWindow = useMemo(() => buildUsageRecordTimeWindow('8h'), [])
  const [range, setRange] = useState<RouterUsageAnalyticsRange>('8h')
  const [page, setPage] = useState(1)
  const [startInput, setStartInput] = useState(initialWindow.startInput)
  const [endInput, setEndInput] = useState(initialWindow.endInput)
  const [effectiveModel, setEffectiveModel] = useState('')
  const [keyId, setKeyId] = useState('')
  const analyticsWindow = useMemo(() => buildUsageRecordAnalyticsWindow(range), [range])

  const { balance, isLoading: balanceLoading, isError: balanceError, mutate: mutateBalance } = useRouterBalance()
  const {
    analytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
    isUnsupported: analyticsUnsupported,
    mutate: mutateAnalytics,
  } = useRouterUsageAnalytics(range)
  const { keys, isLoading: keysLoading, isError: keysError, mutate: mutateKeys } = useRouterKeys()
  const fallbackEnabled = analyticsUnsupported || Boolean(analyticsError)
  const {
    stats: fallbackStats,
    mutate: mutateFallbackStats,
  } = useRouterUsageStats(
    fallbackEnabled
      ? {
          start: analyticsWindow.start,
          end: analyticsWindow.end,
        }
      : undefined
  )
  const {
    events: fallbackEvents,
    isLoading: fallbackEventsLoading,
    isError: fallbackEventsError,
    mutate: mutateFallbackEvents,
  } = useRouterUsageEvents({
    enabled: fallbackEnabled,
    start: analyticsWindow.start,
    end: analyticsWindow.end,
    limit: 100,
    maxPages: 20,
  })

  useEffect(() => {
    const nextWindow = buildUsageRecordTimeWindow(range)
    setStartInput(nextWindow.startInput)
    setEndInput(nextWindow.endInput)
    setPage(1)
  }, [range])

  const logsFilter = useMemo(
    () => ({
      page,
      pageSize: 20,
      start: toUsageRecordQueryValue(startInput),
      end: toUsageRecordQueryValue(endInput),
      effectiveModel: effectiveModel || undefined,
      keyId: keyId ? Number(keyId) : undefined,
    }),
    [effectiveModel, endInput, keyId, page, startInput]
  )

  const { items: logItems, total: logTotal, isLoading: logsLoading, isError: logsError, mutate: mutateLogs } =
    useRouterUsageLogs(logsFilter)

  const fallbackOverview = useMemo(
    () => buildUsageRecordFallbackOverview(fallbackStats, fallbackEvents),
    [fallbackEvents, fallbackStats]
  )
  const fallbackAnalytics = useMemo(() => {
    if (!fallbackEnabled || fallbackEventsLoading || fallbackEventsError) {
      return null
    }

    return buildUsageRecordFallbackAnalytics({
      range,
      stats: fallbackStats,
      events: fallbackEvents,
      currency: balance?.currency || 'CNY',
    })
  }, [balance?.currency, fallbackEnabled, fallbackEvents, fallbackEventsError, fallbackEventsLoading, fallbackStats, range])
  const analyticsData = analytics ?? fallbackAnalytics
  const analyticsViewModel = useMemo(() => buildUsageRecordAnalyticsViewModel(analyticsData), [analyticsData])
  const currency = analyticsData?.currency || balance?.currency || 'CNY'
  const summaryOverview = analyticsData?.overview ?? fallbackOverview
  const successRate = normalizeSuccessRateToPercent(summaryOverview.success_rate)
  const totalPages = Math.ceil(logTotal / 20)
  const keyMap = useMemo(
    () => new Map(keys.map((item) => [item.id, `${item.name} (${item.token_preview})`])),
    [keys]
  )
  const modelOptions = useMemo(
    () => Array.from(new Set(analyticsData?.models.map((item) => item.effective_model) ?? [])),
    [analyticsData?.models]
  )
  const effectiveModelOptions = useMemo(
    () => [
      { value: '', label: '全部' },
      ...modelOptions.map((item) => ({ value: item, label: item })),
    ],
    [modelOptions]
  )
  const keyOptions = useMemo(
    () => [
      { value: '', label: '全部' },
      ...keys.map((item) => ({
        value: String(item.id),
        label: `${item.name} (${item.token_preview})`,
      })),
    ],
    [keys]
  )
  const analyticsAreaLoading = !analytics && fallbackEnabled && fallbackEventsLoading
  const analyticsAreaError = !analytics && !analyticsAreaLoading && Boolean(analyticsError) && Boolean(fallbackEventsError)

  const stackedBarOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: Array<{ axisValueLabel: string; seriesName: string; value: number }>) => {
          const header = params[0]?.axisValueLabel ?? ''
          const rows = params
            .filter((item) => item.value > 0)
            .map((item) => `${item.seriesName}: ${formatCurrency(item.value, currency)}`)
            .join('<br/>')
          return rows ? `${header}<br/>${rows}` : `${header}<br/>暂无花费`
        },
      },
      legend: {
        top: 0,
        data: analyticsViewModel.stackedBar.series.map((item) => item.model),
        textStyle: { color: '#64748b', fontSize: 12 },
      },
      grid: {
        left: 12,
        right: 12,
        top: 48,
        bottom: 12,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: analyticsViewModel.stackedBar.labels,
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisTick: { show: false },
        axisLabel: { color: '#64748b' },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#64748b',
          formatter: (value: number) => value.toFixed(2),
        },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
      },
      series: analyticsViewModel.stackedBar.series.map((item) => ({
        name: item.model,
        type: 'bar',
        stack: 'cost',
        emphasis: { focus: 'series' },
        itemStyle: { color: item.color, borderRadius: [6, 6, 0, 0] },
        data: item.data.map((value) => Number(value.toFixed(6))),
      })),
    }),
    [analyticsViewModel.stackedBar.labels, analyticsViewModel.stackedBar.series, currency]
  )

  const donutOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: (params: { name: string; data: { requestCount: number; requestSharePercent: number } }) =>
          `${params.name}<br/>${formatCompactNumber(params.data.requestCount)} 次请求 (${params.data.requestSharePercent.toFixed(1)}%)`,
      },
      series: [
        {
          type: 'pie',
          radius: ['52%', '72%'],
          center: ['50%', '52%'],
          label: {
            formatter: '{b|{b}}\n{c|{d}%}',
            rich: {
              b: { fontSize: 12, color: '#334155', lineHeight: 18 },
              c: { fontSize: 11, color: '#64748b', lineHeight: 16 },
            },
          },
          data: analyticsViewModel.donut.map((item) => ({
            value: item.requestCount,
            name: item.model,
            requestCount: item.requestCount,
            requestSharePercent: item.requestSharePercent,
            itemStyle: { color: item.color },
          })),
        },
      ],
    }),
    [analyticsViewModel.donut]
  )

  const loading = balanceLoading || analyticsLoading || keysLoading

  if (loading) {
    return (
      <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
        <div className="h-40 animate-pulse rounded-3xl bg-gray-100"></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-3xl bg-gray-100"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr_1fr]">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-[392px] animate-pulse rounded-3xl bg-gray-100"></div>
          ))}
        </div>
      </div>
    )
  }

  if (balanceError || keysError) {
    return (
      <ErrorBanner
        message="使用记录加载失败。"
        onRetry={() => {
          void mutateBalance()
          void mutateAnalytics()
          void mutateKeys()
        }}
      />
    )
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_32%),linear-gradient(145deg,#f8fafc_0%,#ffffff_62%,#eff6ff_100%)] p-7 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <ConsolePageHeader
              badge="USAGE RECORD"
              title="使用记录"
              description="同一时间范围统一驱动总览、模型分析与请求明细。"
            />
            <div className="mt-5 inline-flex rounded-full bg-gray-100 p-1">
              {USAGE_RECORD_RANGES.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={range === option}
                  onClick={() => setRange(option)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    range === option
                      ? 'bg-white text-gray-950 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.75)]'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.28)] backdrop-blur-sm xl:max-w-md">
            <p className="text-sm text-gray-500">当前时间窗口</p>
            <p className="mt-2 text-2xl tracking-tight text-gray-950">{range}</p>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              明细表默认跟随上方时间范围，手动调整筛选后仍可查看更细的时间切片。
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="当前余额"
          value={formatCurrency(balance?.available_balance ?? 0, currency)}
          hint={`总余额 ${formatCurrency(balance?.balance ?? 0, currency)}，冻结 ${formatCurrency(balance?.frozen_amount ?? 0, currency)}`}
        />
        <SummaryCard
          label="使用统计"
          value={formatCompactNumber(summaryOverview.total_requests)}
          hint={`成功 ${formatCompactNumber(summaryOverview.success_requests)} 次`}
        />
        <SummaryCard
          label="花费"
          value={formatCurrency(summaryOverview.total_cost, currency)}
          hint={`${range} 内累计消费`}
        />
        <SummaryCard
          label="成功率"
          value={`${successRate.toFixed(1)}%`}
          hint="按当前全局时间范围聚合"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr_1fr]">
        <PanelShell title="费用分布" description="按时间桶查看各实际模型的花费堆叠。">
          {analyticsAreaLoading ? (
            <PanelLoadingState />
          ) : analyticsAreaError ? (
            <ErrorBanner
              message="模型分析暂时不可用。"
              onRetry={() => {
                void mutateAnalytics()
                void mutateFallbackStats()
                void mutateFallbackEvents()
              }}
            />
          ) : analyticsViewModel.hasData ? (
            <ReactECharts option={stackedBarOption} style={{ height: '320px', width: '100%' }} />
          ) : (
            <PanelEmptyState title="所选时间范围暂无模型花费分布" />
          )}
        </PanelShell>

        <PanelShell title="请求占比" description="按请求量观察模型份额结构。">
          {analyticsAreaLoading ? (
            <PanelLoadingState />
          ) : analyticsAreaError ? (
            <ErrorBanner
              message="模型分析暂时不可用。"
              onRetry={() => {
                void mutateAnalytics()
                void mutateFallbackStats()
                void mutateFallbackEvents()
              }}
            />
          ) : analyticsViewModel.hasData ? (
            <ReactECharts option={donutOption} style={{ height: '320px', width: '100%' }} />
          ) : (
            <PanelEmptyState title="所选时间范围暂无模型请求占比" />
          )}
        </PanelShell>

        <PanelShell title="请求排行" description="同一颜色映射在三张分析卡中保持一致。">
          {analyticsAreaLoading ? (
            <PanelLoadingState />
          ) : analyticsAreaError ? (
            <ErrorBanner
              message="模型分析暂时不可用。"
              onRetry={() => {
                void mutateAnalytics()
                void mutateFallbackStats()
                void mutateFallbackEvents()
              }}
            />
          ) : analyticsViewModel.hasData ? (
            <div className="space-y-3">
              {analyticsViewModel.ranking.map((item, index) => (
                <div
                  key={item.model}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs text-gray-500">
                      {index + 1}
                    </span>
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <div>
                      <p className="text-sm text-gray-950">{item.model}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(item.totalCost, currency)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-950">{formatCompactNumber(item.requestCount)} 次</p>
                    <p className="text-xs text-gray-500">{item.requestSharePercent.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <PanelEmptyState title="所选时间范围暂无模型请求排行" />
          )}
        </PanelShell>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-lg text-gray-950">请求明细</h3>
            <p className="mt-1 text-sm text-gray-500">按时间、实际模型和 KEY 筛选，20 条每页，按最新请求优先展示。</p>
          </div>
          <span className="text-sm text-gray-400">共 {logTotal} 条</span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.1fr_1.1fr_1fr_1fr_auto]">
          <div>
            <label htmlFor="usage-record-start" className="mb-1 block text-xs text-gray-500">
              开始时间
            </label>
            <input
              id="usage-record-start"
              aria-label="开始时间"
              type="datetime-local"
              value={startInput}
              onChange={(event) => {
                setStartInput(event.target.value)
                setPage(1)
              }}
              className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-gray-950"
            />
          </div>
          <div>
            <label htmlFor="usage-record-end" className="mb-1 block text-xs text-gray-500">
              结束时间
            </label>
            <input
              id="usage-record-end"
              aria-label="结束时间"
              type="datetime-local"
              value={endInput}
              onChange={(event) => {
                setEndInput(event.target.value)
                setPage(1)
              }}
              className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-gray-950"
            />
          </div>
          <div>
            <label id="usage-record-model-label" className="mb-1 block text-xs text-gray-500">
              实际模型
            </label>
            <Select
              value={effectiveModel}
              onChange={(nextValue) => {
                setEffectiveModel(nextValue)
                setPage(1)
              }}
              options={effectiveModelOptions}
              className="w-full"
              ariaLabelledBy="usage-record-model-label"
              triggerClassName="rounded-2xl"
              menuClassName="rounded-2xl"
            />
          </div>
          <div>
            <label id="usage-record-key-label" className="mb-1 block text-xs text-gray-500">
              KEY
            </label>
            <Select
              value={keyId}
              onChange={(nextValue) => {
                setKeyId(nextValue)
                setPage(1)
              }}
              options={keyOptions}
              className="w-full"
              ariaLabelledBy="usage-record-key-label"
              triggerClassName="rounded-2xl"
              menuClassName="rounded-2xl"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                const nextWindow = buildUsageRecordTimeWindow(range)
                setStartInput(nextWindow.startInput)
                setEndInput(nextWindow.endInput)
                setEffectiveModel('')
                setKeyId('')
                setPage(1)
              }}
              className="w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
            >
              重置筛选
            </button>
          </div>
        </div>

        <div className="mt-6">
          {logsLoading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
          ) : logsError ? (
            <ErrorBanner message="请求明细加载失败。" onRetry={() => mutateLogs()} />
          ) : logItems.length === 0 ? (
            <EmptyState title="当前筛选条件下没有请求记录" description="调整筛选条件或等待新的 Router 调用。" />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400">
                      <th className="px-3 py-3 font-normal">时间</th>
                      <th className="px-3 py-3 font-normal">请求模型</th>
                      <th className="px-3 py-3 font-normal">实际模型</th>
                      <th className="px-3 py-3 font-normal">KEY</th>
                      <th className="px-3 py-3 font-normal">服务商</th>
                      <th className="px-3 py-3 font-normal">Tokens</th>
                      <th className="px-3 py-3 font-normal">费用</th>
                      <th className="px-3 py-3 font-normal">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logItems.map((event) => (
                      <tr key={event.id} className="border-b border-gray-50 text-gray-700">
                        <td className="px-3 py-3">{formatDateTime(event.created_at)}</td>
                        <td className="px-3 py-3">{event.model_name}</td>
                        <td className="px-3 py-3">{resolveUsageEventEffectiveModel(event)}</td>
                        <td className="px-3 py-3">{keyMap.get(event.api_key_id ?? -1) || '-'}</td>
                        <td className="px-3 py-3">{event.provider_slug || '-'}</td>
                        <td className="px-3 py-3">{formatCompactNumber(event.total_tokens)}</td>
                        <td className="px-3 py-3">{formatCurrency(event.cost, currency)}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs ${
                              isSuccessStatus(event.status)
                                ? 'bg-green-50 text-green-700'
                                : event.status === 3
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {isSuccessStatus(event.status) ? '成功' : event.status === 3 ? '已退款' : '错误'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <Pagination page={page - 1} totalPages={totalPages} onPageChange={(nextPage) => setPage(nextPage + 1)} />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
