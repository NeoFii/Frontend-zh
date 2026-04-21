'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { useRouterUsageEvents, useRouterUsageSummary, useRouterUsageLogs } from '@/hooks/useRouterUsage'
import { useRouterKeys } from '@/hooks/useRouterKeys'
import {
  USAGE_REFERENCE_MODELS,
  createUsageDashboardViewModel,
  formatCompactNumber,
  formatCurrency,
  formatDateTime,
  type UsageRange,
} from '@/lib/router-analytics'

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-primary-500"></div>
    </div>
  ),
})

echarts.use([BarChart, LineChart, PieChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

const RANGES: UsageRange[] = ['24h', '7d', '30d', '90d']
const MODEL_COLORS = ['#0f172a', '#f97316', '#10b981', '#8b5cf6', '#06b6d4', '#ef4444', '#eab308']

function MetricCard(props: { label: string; value: string; hint: string; accent?: string }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_20px_45px_-32px_rgba(15,23,42,0.35)]">
      <p className="text-sm text-gray-500">{props.label}</p>
      <p className="mt-3 text-3xl tracking-tight text-gray-950">{props.value}</p>
      <p className="mt-2 text-xs text-gray-400" style={props.accent ? { color: props.accent } : undefined}>
        {props.hint}
      </p>
    </div>
  )
}

function EmptyPanel(props: { title: string; description: string; compact?: boolean }) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-200 bg-[linear-gradient(180deg,#fafaf9_0%,#ffffff_100%)] p-6">
      <div className="flex h-full min-h-[260px] flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">{props.title}</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">{props.description}</p>
        </div>
        <div className={`grid gap-3 ${props.compact ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {Array.from({ length: props.compact ? 4 : 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl bg-white/80 p-3 ring-1 ring-inset ring-gray-100">
              <div className="h-2 w-16 rounded-full bg-gray-100"></div>
              <div className="mt-3 h-14 rounded-2xl bg-[linear-gradient(90deg,#f3f4f6_0%,#fafafa_50%,#f3f4f6_100%)]"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function UsageRecordPage() {
  const [timeRange, setTimeRange] = useState<UsageRange>('7d')
  const [referenceModelId, setReferenceModelId] = useState('claude-sonnet-4.6')
  const { events, isLoading, isError, mutate } = useRouterUsageEvents({ limit: 100, maxPages: 10 })
  const { summary } = useRouterUsageSummary()
  const { keys } = useRouterKeys()

  // 服务端分页筛选状态
  const [logsPage, setLogsPage] = useState(1)
  const [filterModel, setFilterModel] = useState('')
  const [filterKeyId, setFilterKeyId] = useState<number | undefined>(undefined)
  const [filterStart, setFilterStart] = useState('')
  const [filterEnd, setFilterEnd] = useState('')
  const { items: logItems, total: logTotal, isLoading: logsLoading } = useRouterUsageLogs({
    page: logsPage,
    pageSize: 20,
    modelName: filterModel || undefined,
    keyId: filterKeyId,
    start: filterStart || undefined,
    end: filterEnd || undefined,
  })
  const logTotalPages = Math.ceil(logTotal / 20)

  const dashboard = useMemo(
    () =>
      createUsageDashboardViewModel({
        events,
        summary,
        referenceModelId,
        range: timeRange,
      }),
    [events, summary, referenceModelId, timeRange]
  )

  const topModel = dashboard.modelStats[0]
  const comparisonTone = dashboard.comparison.isSaving
    ? 'text-emerald-600 bg-emerald-50 ring-emerald-100'
    : 'text-amber-700 bg-amber-50 ring-amber-100'
  const comparisonTitle = dashboard.comparison.isSaving ? '预计节省' : '预计溢价'
  const comparisonDescription = dashboard.hasEvents
    ? `与 ${dashboard.comparison.referenceModelName} 作为统一参考模型相比，当前 Router 组合更具成本优势。`
    : '当前时间范围内暂无真实调用记录，图表区域会保留结构化占位。'

  const modelRequestsOption = {
    color: MODEL_COLORS,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: { left: '3%', right: '6%', top: '8%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
    },
    yAxis: {
      type: 'category',
      data: dashboard.modelStats.map((item) => item.model),
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'bar',
        barWidth: 16,
        data: dashboard.modelStats.map((item, index) => ({
          value: item.requests,
          itemStyle: {
            color: MODEL_COLORS[index % MODEL_COLORS.length],
            borderRadius: [0, 6, 6, 0],
          },
        })),
      },
    ],
  }

  const modelCostShareOption = {
    color: MODEL_COLORS,
    tooltip: {
      trigger: 'item',
      formatter: (params: { name: string; value: number; percent: number }) =>
        `${params.name}<br/>${formatCurrency(params.value, dashboard.currency)} (${params.percent}%)`,
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
      textStyle: { color: '#64748b' },
    },
    series: [
      {
        type: 'pie',
        radius: ['48%', '72%'],
        center: ['35%', '50%'],
        label: { show: false },
        data: dashboard.modelStats.map((item, index) => ({
          value: Number(item.totalCost.toFixed(6)),
          name: item.model,
          itemStyle: { color: MODEL_COLORS[index % MODEL_COLORS.length] },
        })),
      },
    ],
  }

  const trendOption = {
    color: ['#0f172a', '#f97316'],
    tooltip: { trigger: 'axis' },
    legend: { data: ['请求数', '费用'], top: 0, right: 0 },
    grid: { left: '3%', right: '4%', top: '18%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: dashboard.dailyTrend.map((item) => item.date),
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
      },
      {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '请求数',
        type: 'line',
        smooth: true,
        data: dashboard.dailyTrend.map((item) => item.requests),
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(15,23,42,0.18)' },
              { offset: 1, color: 'rgba(15,23,42,0)' },
            ],
          },
        },
      },
      {
        name: '费用',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: dashboard.dailyTrend.map((item) => Number(item.totalCost.toFixed(6))),
      },
    ],
  }

  const tokenTrendOption = {
    color: ['#8b5cf6', '#10b981'],
    tooltip: { trigger: 'axis' },
    legend: { data: ['输入 Tokens', '输出 Tokens'], top: 0, right: 0 },
    grid: { left: '3%', right: '4%', top: '18%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: dashboard.dailyTrend.map((item) => item.date),
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
    },
    series: [
      {
        name: '输入 Tokens',
        type: 'line',
        smooth: true,
        stack: 'tokens',
        data: dashboard.dailyTrend.map((item) => item.promptTokens),
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(139,92,246,0.28)' },
              { offset: 1, color: 'rgba(139,92,246,0.05)' },
            ],
          },
        },
      },
      {
        name: '输出 Tokens',
        type: 'line',
        smooth: true,
        stack: 'tokens',
        data: dashboard.dailyTrend.map((item) => item.completionTokens),
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16,185,129,0.28)' },
              { offset: 1, color: 'rgba(16,185,129,0.05)' },
            ],
          },
        },
      },
    ],
  }

  if (isLoading) {
    return (
      <div className="space-y-4" style={{ fontFamily: 'MiSans, sans-serif' }}>
        <div className="h-40 animate-pulse rounded-2xl bg-gray-100"></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-3xl bg-gray-100"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="h-80 animate-pulse rounded-3xl bg-gray-100"></div>
          <div className="h-80 animate-pulse rounded-3xl bg-gray-100"></div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-600" style={{ fontFamily: 'MiSans, sans-serif' }}>
        用量数据加载失败。
        <button onClick={() => mutate()} className="ml-2 font-medium text-red-700 hover:text-red-900">
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_32%),linear-gradient(145deg,#0f172a_0%,#111827_45%,#1f2937_100%)] text-white shadow-[0_35px_80px_-45px_rgba(15,23,42,0.75)]">
        <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.6fr_1fr] lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs tracking-[0.24em] text-white/80">ROUTER USAGE</span>
              <span className={`rounded-full px-3 py-1 text-xs ring-1 ${comparisonTone}`}>
                {comparisonTitle} {formatCurrency(Math.abs(dashboard.comparison.savedAmount), dashboard.currency)}
              </span>
            </div>
            <h2 className="mt-5 text-3xl tracking-tight text-white">真实 Router 用量仪表盘</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              {comparisonDescription}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">当前费用</p>
                <p className="mt-3 text-2xl text-white">{formatCurrency(dashboard.comparison.actualCost, dashboard.currency)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">参考费用</p>
                <p className="mt-3 text-2xl text-white">
                  {formatCurrency(dashboard.comparison.theoreticalCost, dashboard.currency)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">成功率</p>
                <p className="mt-3 text-2xl text-white">{dashboard.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">参考模型对比</p>
                <p className="mt-1 text-xs text-slate-400">用于估算统一落在单一参考模型时的理论费用。</p>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              {USAGE_REFERENCE_MODELS.map((model) => {
                const active = model.id === referenceModelId
                return (
                  <button
                    key={model.id}
                    onClick={() => setReferenceModelId(model.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                      active
                        ? 'border-white/20 bg-white text-slate-900'
                        : 'border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.10]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: model.color }}></span>
                      <span className="text-sm font-medium">{model.name}</span>
                    </div>
                    <span className={`text-xs ${active ? 'text-slate-500' : 'text-slate-400'}`}>
                      {active ? '当前参考' : '切换'}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/[0.15] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">范围</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {RANGES.map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`rounded-full px-3 py-1.5 text-sm transition ${
                      timeRange === range ? 'bg-white text-slate-950' : 'bg-white/[0.08] text-slate-200 hover:bg-white/[0.14]'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="总请求数"
          value={formatCompactNumber(dashboard.aggregate.totalRequests)}
          hint={`${timeRange} 内累计请求`}
        />
        <MetricCard
          label="总 Tokens"
          value={formatCompactNumber(dashboard.aggregate.totalTokens)}
          hint={`${formatCompactNumber(dashboard.aggregate.promptTokens)} 输入 / ${formatCompactNumber(dashboard.aggregate.completionTokens)} 输出`}
        />
        <MetricCard
          label="总费用"
          value={formatCurrency(dashboard.aggregate.totalCost, dashboard.currency)}
          hint="按后端实时计费结果聚合"
        />
        <MetricCard
          label="节省比例"
          value={`${Math.abs(dashboard.comparison.savingsPercentage).toFixed(1)}%`}
          hint={dashboard.comparison.isSaving ? '相对参考模型的成本优势' : '当前策略高于参考模型'}
          accent={dashboard.comparison.isSaving ? '#059669' : '#b45309'}
        />
        <MetricCard
          label="主力模型"
          value={topModel?.model ?? '-'}
          hint={topModel ? `${formatCompactNumber(topModel.requests)} 次请求 / ${formatCurrency(topModel.totalCost, dashboard.currency)}` : '等待调用记录'}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">成本对比总览</p>
              <p className="mt-1 text-sm text-gray-500">基于真实 usage events 聚合，并按参考模型估算对比。</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs ring-1 ${comparisonTone}`}>
              {dashboard.comparison.isSaving ? '成本更低' : '成本更高'}
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Router 当前</p>
              <p className="mt-3 text-3xl">{formatCurrency(dashboard.comparison.actualCost, dashboard.currency)}</p>
              <p className="mt-2 text-xs text-slate-400">来自 {timeRange} 内真实成功与失败请求。</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">参考模型</p>
              <p className="mt-3 text-3xl text-gray-950">{formatCurrency(dashboard.comparison.theoreticalCost, dashboard.currency)}</p>
              <p className="mt-2 text-xs text-gray-500">以 {dashboard.comparison.referenceModelName} 统一承载的理论值。</p>
            </div>
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">差额</p>
              <p className={`mt-3 text-3xl ${dashboard.comparison.isSaving ? 'text-emerald-600' : 'text-amber-700'}`}>
                {dashboard.comparison.isSaving ? '-' : '+'}
                {formatCurrency(Math.abs(dashboard.comparison.savedAmount), dashboard.currency)}
              </p>
              <p className="mt-2 text-xs text-gray-500">用于观察智能路由在成本上的整体收益。</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <p className="text-sm font-medium text-gray-900">观测重点</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">最近窗口</p>
              <p className="mt-2 text-lg text-gray-900">{timeRange}</p>
              <p className="mt-2 text-sm text-gray-500">当前页面所有统计和图表都基于选中的时间范围重新聚合。</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">模型覆盖</p>
              <p className="mt-2 text-lg text-gray-900">{dashboard.modelStats.length || 0} 个模型</p>
              <p className="mt-2 text-sm text-gray-500">会把不同厂商的同族模型名称标准化后再参与排行与成本测算。</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">数据状态</p>
              <p className="mt-2 text-lg text-gray-900">{dashboard.hasEvents ? '已有真实调用' : '暂无窗口数据'}</p>
              <p className="mt-2 text-sm text-gray-500">即使没有记录，也会保留完整面板结构，方便继续联调与截图验收。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <div className="mb-3 px-2 pt-2 text-sm font-medium text-gray-900">模型请求排行</div>
          {dashboard.hasEvents ? (
            <ReactECharts option={modelRequestsOption} style={{ height: '320px' }} />
          ) : (
            <EmptyPanel title="模型请求排行" description="接入真实请求后，这里会展示不同模型的调用次数分布。" compact />
          )}
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <div className="mb-3 px-2 pt-2 text-sm font-medium text-gray-900">模型费用占比</div>
          {dashboard.hasEvents ? (
            <ReactECharts option={modelCostShareOption} style={{ height: '320px' }} />
          ) : (
            <EmptyPanel title="模型费用占比" description="当 Router 写入真实账单后，这里会呈现费用结构，帮助判断高成本模型来源。" compact />
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <div className="mb-3 px-2 pt-2 text-sm font-medium text-gray-900">请求与费用趋势</div>
          {dashboard.hasEvents ? (
            <ReactECharts option={trendOption} style={{ height: '320px' }} />
          ) : (
            <EmptyPanel title="请求与费用趋势" description="趋势图会在有真实 usage events 后按天聚合请求量与费用。" />
          )}
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <div className="mb-3 px-2 pt-2 text-sm font-medium text-gray-900">Token 趋势</div>
          {dashboard.hasEvents ? (
            <ReactECharts option={tokenTrendOption} style={{ height: '320px' }} />
          ) : (
            <EmptyPanel title="Token 趋势" description="这里会拆分输入与输出 token 的变化，用于识别上下文长度和输出长度的波动。" />
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-lg text-gray-900">请求明细</h3>
            <p className="mt-1 text-sm text-gray-500">支持按日期、模型、API Key 筛选，服务端分页。</p>
          </div>
          <span className="text-sm text-gray-400">共 {logTotal} 条</span>
        </div>

        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">开始时间</label>
            <input
              type="datetime-local"
              value={filterStart}
              onChange={(e) => { setFilterStart(e.target.value); setLogsPage(1) }}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-950"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">结束时间</label>
            <input
              type="datetime-local"
              value={filterEnd}
              onChange={(e) => { setFilterEnd(e.target.value); setLogsPage(1) }}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-950"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">模型名</label>
            <input
              type="text"
              value={filterModel}
              onChange={(e) => { setFilterModel(e.target.value); setLogsPage(1) }}
              placeholder="如 gpt-4o"
              className="w-40 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-950"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">API Key</label>
            <select
              value={filterKeyId ?? ''}
              onChange={(e) => { setFilterKeyId(e.target.value ? Number(e.target.value) : undefined); setLogsPage(1) }}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-950"
            >
              <option value="">全部</option>
              {keys.map((k) => (
                <option key={k.id} value={k.id}>{k.name} ({k.token_preview})</option>
              ))}
            </select>
          </div>
          {(filterStart || filterEnd || filterModel || filterKeyId) && (
            <button
              onClick={() => { setFilterStart(''); setFilterEnd(''); setFilterModel(''); setFilterKeyId(undefined); setLogsPage(1) }}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50"
            >
              清除筛选
            </button>
          )}
        </div>

        {logsLoading ? (
          <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
        ) : logItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-14 text-center">
            <p className="text-base text-gray-900">当前筛选条件下没有请求记录</p>
            <p className="mt-2 text-sm text-gray-500">调整筛选条件或等待新的 Router 调用。</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400">
                    <th className="px-3 py-3 font-normal">时间</th>
                    <th className="px-3 py-3 font-normal">模型</th>
                    <th className="px-3 py-3 font-normal">Tokens</th>
                    <th className="px-3 py-3 font-normal">费用</th>
                    <th className="px-3 py-3 font-normal">耗时</th>
                    <th className="px-3 py-3 font-normal">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {logItems.map((event) => (
                    <tr key={event.id} className="border-b border-gray-50 text-gray-700">
                      <td className="px-3 py-3">{formatDateTime(event.created_at)}</td>
                      <td className="px-3 py-3">{event.model_name}</td>
                      <td className="px-3 py-3">{formatCompactNumber(event.total_tokens)}</td>
                      <td className="px-3 py-3">{formatCurrency(event.cost, dashboard.currency)}</td>
                      <td className="px-3 py-3">{event.duration_ms != null ? `${event.duration_ms}ms` : '-'}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${
                            event.status === 1
                              ? 'bg-green-50 text-green-700'
                              : event.status === 3
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {event.status === 1 ? '成功' : event.status === 3 ? '已退款' : '错误'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {logTotalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
                  disabled={logsPage <= 1}
                  className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                >
                  上一页
                </button>
                <span className="text-sm text-gray-500">{logsPage} / {logTotalPages}</span>
                <button
                  onClick={() => setLogsPage((p) => Math.min(logTotalPages, p + 1))}
                  disabled={logsPage >= logTotalPages}
                  className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
