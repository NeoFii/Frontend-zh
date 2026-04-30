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
  buildUsageRecordTimeWindow,
  resolveUsageEventEffectiveModel,
  toUsageRecordQueryValue,
} from '@/lib/usage-record-analytics'

function isSuccessStatus(status: number) {
  return status === 1 || status === 200
}

export default function BalancePage() {
  const router = useRouter()
  const { keys, isLoading: keysLoading } = useRouterKeys()
  const { balance, isLoading: balanceLoading } = useRouterBalance()
  const { summary, isLoading: summaryLoading } = useRouterUsageSummary()
  const { events, isLoading: eventsLoading } = useRouterUsageEvents({ limit: 100, maxPages: 10 })

  const initialWindow = useMemo(() => buildUsageRecordTimeWindow('24h'), [])
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
  const keyMap = useMemo(
    () => new Map(keys.map((item) => [item.id, `${item.name} (${item.token_preview})`])),
    [keys]
  )
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
        label: `${item.name} (${item.token_preview})`,
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
                const nextWindow = buildUsageRecordTimeWindow('24h')
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
                      <th className="px-3 py-3 font-normal">时间</th>
                      <th className="px-3 py-3 font-normal">调用模型</th>
                      <th className="px-3 py-3 font-normal">KEY</th>
                      <th className="px-3 py-3 font-normal">总 Tokens</th>
                      <th className="px-3 py-3 font-normal">费用</th>
                      <th className="px-3 py-3 font-normal">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logItems.map((event) => (
                      <tr key={event.id} className="border-b border-gray-50 text-gray-700">
                        <td className="px-3 py-3">{formatDateTime(event.created_at)}</td>
                        <td className="px-3 py-3">{resolveUsageEventEffectiveModel(event)}</td>
                        <td className="px-3 py-3">{keyMap.get(event.api_key_id ?? -1) || '-'}</td>
                        <td className="px-3 py-3">{formatCompactNumber(event.total_tokens)}</td>
                        <td className="px-3 py-3">{formatCurrencyDetail(event.cost, currency)}</td>
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
