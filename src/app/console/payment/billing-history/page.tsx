'use client'

import { useState } from 'react'
import { useRouterBillingLedger } from '@/hooks/useRouterUsage'
import { transactionTypeMeta } from '@/lib/api/router'
import { formatCurrency, formatDateTime } from '@/lib/router-analytics'
import ConsolePageHeader from '@/components/ui/ConsolePageHeader'
import ErrorBanner from '@/components/ui/ErrorBanner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'

const CURRENCY = 'CNY'
const PAGE_SIZE = 10
const TX_TYPE_VOUCHER_REDEEM = 7

const TYPE_TABS: Array<{ value: number | null; label: string }> = [
  { value: null, label: '全部' },
  { value: 1, label: '充值' },
  { value: 2, label: '消费' },
  { value: 3, label: '退款' },
  { value: 4, label: '冻结' },
  { value: 5, label: '解冻' },
  { value: 6, label: '调整' },
  { value: 7, label: '代金券' },
]

function transactionDisplayTitle(item: { type: number; description: string | null }, fallback: string) {
  if (item.type === TX_TYPE_VOUCHER_REDEEM) {
    return '代金券兑换'
  }
  return item.description || fallback
}

function shouldShowTransactionReference(type: number) {
  return type !== TX_TYPE_VOUCHER_REDEEM
}

export default function BillingHistoryPage() {
  const [page, setPage] = useState(0)
  const [typeFilter, setTypeFilter] = useState<number | null>(null)
  const { items, total, isLoading, isError, mutate } = useRouterBillingLedger({
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
    type: typeFilter ?? undefined,
  })

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const showGlobalEmpty = typeFilter === null && items.length === 0
  const handleTypeChange = (value: number | null) => {
    setTypeFilter(value)
    setPage(0)
  }

  if (isLoading) {
    return (
      <div className="space-y-4" style={{ fontFamily: 'MiSans, sans-serif' }}>
        <div className="h-40 animate-pulse rounded-2xl bg-gray-100"></div>
        <div className="h-72 animate-pulse rounded-2xl bg-gray-100"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorBanner message="账单记录加载失败。" onRetry={() => mutate()} />
    )
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <ConsolePageHeader badge="BILLING LEDGER" title="账单历史与账务流水" description="这里按账户余额流水实时渲染入账、调整、冻结和扣费记录，用于核对每次资金变化和调用来源。" />

      {showGlobalEmpty ? (
        <EmptyState title="暂无账单流水。" />
      ) : (
        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <div className="mb-4 flex flex-wrap gap-2 px-2">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.value ?? 'all'}
                onClick={() => handleTypeChange(tab.value)}
                className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                  typeFilter === tab.value
                    ? 'bg-gray-950 text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
              当前类型下暂无记录。
            </div>
          ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const meta = transactionTypeMeta(item.type)
              const isPositive = item.direction === 'credit' || (item.direction === 'adjust' && item.amount >= 0)
              const amountPrefix = isPositive ? '+' : '-'
              const showReference = shouldShowTransactionReference(item.type)

              return (
                <div key={item.id} className="flex flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${meta.iconTone}`}>
                      {meta.label.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm text-gray-900">{transactionDisplayTitle(item, meta.label)}</p>
                        <span className={`rounded-full px-2.5 py-1 text-xs ${meta.tone}`}>{meta.label}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span>{formatDateTime(item.created_at)}</span>
                        {showReference && (
                          <>
                            <span>{item.ref_type || 'manual'}</span>
                            <span>{item.ref_id || '-'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : item.direction === 'adjust' ? 'text-amber-700' : 'text-gray-900'}`}>
                      {amountPrefix}{formatCurrency(Math.abs(item.amount), CURRENCY)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      余额: {item.balance_after === null ? '-' : formatCurrency(item.balance_after, CURRENCY)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          )}
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </section>
      )}
    </div>
  )
}
