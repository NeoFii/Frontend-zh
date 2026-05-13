'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRouterKeys } from '@/hooks/useRouterKeys'
import {
  useRouterBalance,
  useRouterUsageEvents,
  useRouterUsageLogs,
  useRouterUsageSummary,
} from '@/hooks/useRouterUsage'
import ConsolePageHeader from '@/components/ui/ConsolePageHeader'
import ErrorBanner from '@/components/ui/ErrorBanner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'
import { Select } from '@/components/ui/Select'
import {
  calculateMonthlySpend,
  calculateSuccessRate,
  countActiveKeys,
  extractCurrency,
  formatCompactNumber,
  formatCurrency,
  formatCurrencyDetail,
  formatDateTime,
  summarizeUsageEvents,
  usageSummaryToAggregate,
} from '@/lib/router-analytics'
import {
  resolveUsageEventEffectiveModel,
  toUsageRecordQueryValue,
} from '@/lib/usage-record-analytics'
import { formatShanghaiDateTimeLocalInput } from '@/lib/time'

const MODEL_PILL_COLORS = [
  'bg-blue-50 text-blue-700',
  'bg-orange-50 text-orange-700',
  'bg-emerald-50 text-emerald-700',
  'bg-violet-50 text-violet-700',
  'bg-red-50 text-red-700',
  'bg-cyan-50 text-cyan-700',
  'bg-yellow-50 text-yellow-700',
  'bg-pink-50 text-pink-700',
]

function getModelPillColor(model: string): string {
  let hash = 0
  for (let i = 0; i < model.length; i++) {
    hash = ((hash << 5) - hash + model.charCodeAt(i)) | 0
  }
  return MODEL_PILL_COLORS[Math.abs(hash) % MODEL_PILL_COLORS.length]
}

export default function BalancePage() {
  const router = useRouter()
  const { keys, isLoading: keysLoading } = useRouterKeys()
  const { balance, isLoading: balanceLoading } = useRouterBalance()
  const { summary, isLoading: summaryLoading } = useRouterUsageSummary()
  const { events, isLoading: eventsLoading } = useRouterUsageEvents({ limit: 100, maxPages: 10 })

  const initialWindow = useMemo(() => {
    const now = new Date()
    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)
    return {
      startInput: formatShanghaiDateTimeLocalInput(startOfToday),
      endInput: formatShanghaiDateTimeLocalInput(now),
    }
  }, [])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [startInput, setStartInput] = useState(initialWindow.startInput)
  const [endInput, setEndInput] = useState(initialWindow.endInput)
  const [effectiveModel, setEffectiveModel] = useState('')
  const [keyId, setKeyId] = useState('')

  const logsFilter = useMemo(
    () => ({
      page,
      pageSize,
      start: toUsageRecordQueryValue(startInput),
      end: toUsageRecordQueryValue(endInput),
      effectiveModel: effectiveModel || undefined,
      keyId: keyId ? Number(keyId) : undefined,
    }),
    [effectiveModel, endInput, keyId, page, pageSize, startInput]
  )

  const { items: logItems, total: logTotal, isLoading: logsLoading, isError: logsError, mutate: mutateLogs } =
    useRouterUsageLogs(logsFilter)

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

  const totalPages = Math.ceil(logTotal / pageSize)
  const logsInitialLoading = logsLoading && logItems.length === 0
  const modelOptions = useMemo(
    () => Array.from(new Set(logItems.map((item) => resolveUsageEventEffectiveModel(item)).filter((m) => m !== '-'))),
    [logItems]
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
        label: item.name,
      })),
    ],
    [keys]
  )

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <section className="rounded-lg bg-[#f7f7f8] px-8 py-7 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.2)] ring-1 ring-inset ring-gray-100">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <ConsolePageHeader
              badge="BALANCE"
              title="账户余额"
              description={`总余额 ${loading ? '...' : formatCurrency(totalBalance, balanceCurrency)}，冻结 ${loading ? '...' : formatCurrency(frozenAmount, balanceCurrency)}`}
            />
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
            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
              <p className="text-sm text-gray-500">本月累计花费</p>
              <p className="mt-2 text-2xl tracking-tight text-gray-950">
                {loading ? '...' : formatCurrency(monthlySpend, currency)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
              <p className="text-sm text-gray-500">总请求数</p>
              <p className="mt-2 text-2xl tracking-tight text-gray-950">
                {loading ? '...' : formatCompactNumber(aggregate.totalRequests)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
              <p className="text-sm text-gray-500">成功率</p>
              <p className="mt-2 text-2xl tracking-tight text-gray-950">
                {loading ? '...' : `${successRate.toFixed(1)}%`}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
              <p className="text-sm text-gray-500">启用中的 Key</p>
              <p className="mt-2 text-2xl tracking-tight text-gray-950">{loading ? '...' : String(activeKeys)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-lg text-gray-950">请求明细</h3>
          </div>
          <span className="text-sm text-gray-400">共 {logTotal} 条</span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.1fr_1.1fr_1fr_1fr_auto]">
          <div>
            <label htmlFor="balance-log-start" className="mb-1 block text-xs text-gray-500">
              开始时间
            </label>
            <input
              id="balance-log-start"
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
            <label htmlFor="balance-log-end" className="mb-1 block text-xs text-gray-500">
              结束时间
            </label>
            <input
              id="balance-log-end"
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
            <label id="balance-log-model-label" className="mb-1 block text-xs text-gray-500">
              调用模型
            </label>
            <Select
              value={effectiveModel}
              onChange={(nextValue) => {
                setEffectiveModel(nextValue)
                setPage(1)
              }}
              options={effectiveModelOptions}
              className="w-full"
              ariaLabelledBy="balance-log-model-label"
              triggerClassName="rounded-2xl"
              menuClassName="rounded-2xl"
            />
          </div>
          <div>
            <label id="balance-log-key-label" className="mb-1 block text-xs text-gray-500">
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
              ariaLabelledBy="balance-log-key-label"
              triggerClassName="rounded-2xl"
              menuClassName="rounded-2xl"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                const now = new Date()
                const startOfToday = new Date(now)
                startOfToday.setHours(0, 0, 0, 0)
                setStartInput(formatShanghaiDateTimeLocalInput(startOfToday))
                setEndInput(formatShanghaiDateTimeLocalInput(now))
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
          {logsInitialLoading ? (
            <div className="h-40 animate-pulse rounded-lg bg-gray-100" />
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
                      <th className="px-3 py-3 font-normal w-[140px]">时间</th>
                      <th className="px-3 py-3 font-normal">模型</th>
                      <th className="px-3 py-3 font-normal">Key</th>
                      <th className="px-3 py-3 font-normal w-[100px]">输入</th>
                      <th className="px-3 py-3 font-normal w-[80px]">输出</th>
                      <th className="px-3 py-3 font-normal w-[100px]">花费</th>
                      <th className="px-3 py-3 font-normal w-[70px]">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logItems.map((event) => (
                      <tr key={event.id} className="border-b border-gray-50 text-gray-700">
                        <td className="px-3 py-3 whitespace-nowrap">{formatDateTime(event.created_at)}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-block max-w-[120px] truncate rounded-full px-2.5 py-0.5 text-xs font-medium ${getModelPillColor(resolveUsageEventEffectiveModel(event))}`}>
                            {resolveUsageEventEffectiveModel(event)}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-block max-w-[120px] truncate rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                            {event.api_key_name || '-'}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div>{formatCompactNumber(event.prompt_tokens)}</div>
                          {event.cached_tokens > 0 && (
                            <div className="text-xs text-gray-400">
                              缓存读 {formatCompactNumber(event.cached_tokens)} tokens
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3">{formatCompactNumber(event.completion_tokens)}</td>
                        <td className="px-3 py-3">{formatCurrencyDetail(event.cost, currency)}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            event.status === 1 ? 'border-green-200 bg-green-50 text-green-700'
                              : event.status === 2 ? 'border-red-200 bg-red-50 text-red-700'
                              : event.status === 3 ? 'border-amber-200 bg-amber-50 text-amber-700'
                              : 'border-gray-200 bg-gray-50 text-gray-600'
                          }`}>
                            {event.status === 1 ? '成功' : event.status === 2 ? '错误' : event.status === 3 ? '已退款' : event.status === 4 ? '中止' : '待处理'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={page - 1}
                totalPages={totalPages}
                onPageChange={(nextPage) => setPage(nextPage + 1)}
                pageSize={pageSize}
                onPageSizeChange={(nextSize) => {
                  setPageSize(nextSize)
                  setPage(1)
                }}
                total={logTotal}
              />
            </>
          )}
        </div>
      </section>
    </div>
  )
}
