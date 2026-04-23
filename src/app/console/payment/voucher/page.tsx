'use client'

import { useState } from 'react'
import { mutate } from 'swr'
import { redeemVoucher, type VoucherRedeemResult } from '@/lib/api/router'
import { useVoucherRedemptions } from '@/hooks/useRouterUsage'
import { formatCurrency } from '@/lib/router-analytics'
import { formatDateTime } from '@/lib/router-analytics'
import { extractErrorMessage } from '@/lib/error'
import ConsolePageHeader from '@/components/ui/ConsolePageHeader'
import EmptyState from '@/components/ui/EmptyState'
import ErrorBanner from '@/components/ui/ErrorBanner'
import Pagination from '@/components/ui/Pagination'

const CURRENCY = 'CNY'
const PAGE_SIZE = 10

function voucherStatusLabel(status: number) {
  switch (status) {
    case 2:
      return { label: '已兑换', tone: 'bg-emerald-50 text-emerald-700' }
    case 3:
      return { label: '已禁用', tone: 'bg-gray-100 text-gray-500' }
    default:
      return { label: '未兑换', tone: 'bg-amber-50 text-amber-700' }
  }
}

export default function VoucherPage() {
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<VoucherRedeemResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const {
    items: redemptions,
    total,
    isLoading: historyLoading,
    isError: historyError,
    mutate: mutateRedemptions,
  } = useVoucherRedemptions({ limit: PAGE_SIZE, offset: page * PAGE_SIZE })
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handleRedeem = async () => {
    const trimmed = code.trim()
    if (!trimmed) return

    setSubmitting(true)
    setError(null)
    setResult(null)

    try {
      const response = await redeemVoucher(trimmed)
      setResult(response.data)
      setCode('')
      setPage(0)
      mutate('router-balance')
      mutateRedemptions()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <ConsolePageHeader badge="VOUCHER" title="代金券兑换" description="输入兑换码，将代金券余额充入账户。" />

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
        <h3 className="text-sm font-medium text-gray-900">输入兑换码</h3>
        <p className="mt-1 text-sm text-gray-500">兑换成功后金额将立即到账，可在余额页面查看。</p>

        <div className="mt-5 flex items-end gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !submitting) handleRedeem() }}
              placeholder="请输入兑换码"
              maxLength={64}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950"
            />
          </div>
          <button
            onClick={handleRedeem}
            disabled={submitting || !code.trim()}
            className="rounded-full bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitting ? '兑换中...' : '兑换'}
          </button>
        </div>

        {result && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <p className="text-sm font-medium text-emerald-700">
              兑换成功，已到账 {formatCurrency(result.amount, CURRENCY)}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="text-sm font-medium text-gray-900">兑换历史</h3>
          <p className="mt-1 text-sm text-gray-500">仅显示当前账户已兑换的代金券记录。</p>
        </div>

        {historyLoading ? (
          <div className="p-6">
            <div className="h-32 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        ) : historyError ? (
          <div className="p-6">
            <ErrorBanner message="兑换历史加载失败。" onRetry={() => mutateRedemptions()} />
          </div>
        ) : redemptions.length === 0 ? (
          <EmptyState title="暂无兑换历史。" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#edf2f7] text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">券号</th>
                    <th className="px-6 py-4 font-medium">到账金额</th>
                    <th className="px-6 py-4 font-medium">状态</th>
                    <th className="px-6 py-4 font-medium">兑换时间</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((item) => {
                    const statusMeta = voucherStatusLabel(item.status)
                    return (
                      <tr key={item.id} className="border-t border-gray-100 text-gray-700">
                        <td className="px-6 py-5 font-mono text-sm">{item.code_prefix}...{item.code_suffix}</td>
                        <td className="px-6 py-5 text-sm text-emerald-600">{formatCurrency(item.amount, CURRENCY)}</td>
                        <td className="px-6 py-5">
                          <span className={`rounded-full px-2.5 py-1 text-xs ${statusMeta.tone}`}>{statusMeta.label}</span>
                        </td>
                        <td className="px-6 py-5 text-sm">{formatDateTime(item.redeemed_at)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </>
        )}
      </section>
    </div>
  )
}
