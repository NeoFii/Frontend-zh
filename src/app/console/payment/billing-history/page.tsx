'use client'

import { useRouterBillingLedger } from '@/hooks/useRouterUsage'
import { formatCurrency, formatDateTime } from '@/lib/router-analytics'

function directionMeta(direction: string) {
  if (direction === 'credit') {
    return { label: '入账', tone: 'bg-emerald-50 text-emerald-700', iconTone: 'bg-emerald-100 text-emerald-700' }
  }
  if (direction === 'adjust') {
    return { label: '调整', tone: 'bg-amber-50 text-amber-700', iconTone: 'bg-amber-100 text-amber-700' }
  }
  return { label: '扣费', tone: 'bg-gray-100 text-gray-700', iconTone: 'bg-gray-100 text-gray-700' }
}

export default function BillingHistoryPage() {
  const { items, total, isLoading, isError, mutate } = useRouterBillingLedger({ limit: 100, offset: 0 })

  if (isLoading) {
    return (
      <div className="space-y-4" style={{ fontFamily: 'MiSans, sans-serif' }}>
        <div className="h-40 animate-pulse rounded-[32px] bg-gray-100"></div>
        <div className="h-72 animate-pulse rounded-[28px] bg-gray-100"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600" style={{ fontFamily: 'MiSans, sans-serif' }}>
        账单记录加载失败。
        <button onClick={() => mutate()} className="ml-2 font-medium text-red-700 hover:text-red-900">
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <section className="overflow-hidden rounded-[32px] border border-gray-200 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_32%),linear-gradient(145deg,#ffffff_0%,#f8fafc_100%)] p-8 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.22)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-gray-950 px-3 py-1 text-xs font-medium tracking-[0.24em] text-white">
              BILLING LEDGER
            </div>
            <h2 className="mt-5 text-[1.75rem] tracking-tight text-gray-950">账单历史与账务流水</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              这里按 Router billing ledger 实时渲染入账、调整和扣费记录，用于核对每次资金变化和调用来源。
            </p>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-white px-5 py-4 text-right">
            <p className="text-xs tracking-[0.2em] text-gray-400">TOTAL RECORDS</p>
            <p className="mt-2 text-2xl text-gray-950">{total}</p>
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="rounded-[30px] border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-gray-500">
          暂无账单流水。
        </div>
      ) : (
        <section className="rounded-[30px] border border-gray-100 bg-white p-4 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const meta = directionMeta(item.direction)
              const isPositive = item.direction === 'credit' || (item.direction === 'adjust' && item.amount >= 0)
              const amountPrefix = isPositive ? '+' : '-'

              return (
                <div key={item.id} className="flex flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${meta.iconTone}`}>
                      {meta.label.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm text-gray-900">{item.description || meta.label}</p>
                        <span className={`rounded-full px-2.5 py-1 text-xs ${meta.tone}`}>{meta.label}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span>{formatDateTime(item.created_at)}</span>
                        <span>Key #{item.router_api_key_id ?? '-'}</span>
                        <span>Usage #{item.usage_event_id ?? '-'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : item.direction === 'adjust' ? 'text-amber-700' : 'text-gray-900'}`}>
                      {amountPrefix}{formatCurrency(Math.abs(item.amount), item.currency)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      余额: {item.balance_after === null ? '-' : formatCurrency(item.balance_after, item.currency)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
