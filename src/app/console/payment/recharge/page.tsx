'use client'

import { useEffect, useRef, useState } from 'react'
import { extractErrorMessage } from '@/lib/error'
import { createAlipayOrder, fetchTopupOrders } from '@/lib/api/router'
import type { TopupOrderItem } from '@/lib/api/router'
import { formatCurrency, formatDateTime } from '@/lib/router-analytics'
import ConsolePageHeader from '@/components/ui/ConsolePageHeader'
import ErrorBanner from '@/components/ui/ErrorBanner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'

const CURRENCY = 'CNY'
const PAGE_SIZE = 10

const AMOUNT_TIERS = [
  { label: '10 元', value: 10 },
  { label: '50 元', value: 50 },
  { label: '100 元', value: 100 },
  { label: '500 元', value: 500 },
]

function orderStatusLabel(status: number) {
  switch (status) {
    case 1: return { label: '待支付', tone: 'bg-amber-50 text-amber-700' }
    case 2: return { label: '已支付', tone: 'bg-emerald-50 text-emerald-700' }
    case 3: return { label: '已取消', tone: 'bg-gray-100 text-gray-500' }
    case 4: return { label: '已退款', tone: 'bg-blue-50 text-blue-700' }
    default: return { label: '未知', tone: 'bg-gray-100 text-gray-500' }
  }
}

function detectDevice(): 'pc' | 'mobile' {
  if (typeof window === 'undefined') return 'pc'
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ? 'mobile' : 'pc'
}

export default function RechargePage() {
  const [orders, setOrders] = useState<TopupOrderItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  const formContainerRef = useRef<HTMLDivElement>(null)

  const effectiveAmount = selectedTier ?? (customAmount ? parseFloat(customAmount) : 0)
  const isValidAmount = effectiveAmount >= 1 && effectiveAmount <= 10000

  useEffect(() => {
    setLoading(true)
    fetchTopupOrders({ page, page_size: PAGE_SIZE })
      .then((res) => {
        setOrders(res.data.items)
        setTotal(res.data.total)
        setError(null)
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [page])

  async function handlePay() {
    if (!isValidAmount || paying) return
    setPaying(true)
    setPayError(null)
    try {
      const microAmount = Math.round(effectiveAmount * 1_000_000)
      const device = detectDevice()
      const result = await createAlipayOrder({ amount: microAmount, device })

      // Inject the form HTML and auto-submit to redirect to Alipay
      if (formContainerRef.current) {
        formContainerRef.current.innerHTML = result.form_html
        const form = formContainerRef.current.querySelector('form')
        if (form) {
          form.submit()
          return
        }
        // If it's a URL (GET mode), redirect directly
        if (result.form_html.startsWith('http')) {
          window.location.href = result.form_html
          return
        }
      }
    } catch (err) {
      setPayError(extractErrorMessage(err))
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <ConsolePageHeader badge="PAYMENT" title="充值" description="选择金额，通过支付宝完成充值。" />

      {/* Recharge Form */}
      <section className="rounded-lg bg-white p-6 ring-1 ring-inset ring-gray-100">
        <h3 className="mb-4 text-sm font-medium text-gray-700">选择充值金额</h3>
        <div className="flex flex-wrap gap-3">
          {AMOUNT_TIERS.map((tier) => (
            <button
              key={tier.value}
              onClick={() => { setSelectedTier(tier.value); setCustomAmount('') }}
              className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors ${
                selectedTier === tier.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm text-gray-500">自定义金额（元）</label>
          <input
            type="number"
            min="1"
            max="10000"
            step="0.01"
            placeholder="输入 1 ~ 10000"
            value={customAmount}
            onChange={(e) => { setCustomAmount(e.target.value); setSelectedTier(null) }}
            className="w-48 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>

        {payError && <p className="mt-3 text-sm text-red-600">{payError}</p>}

        <button
          onClick={handlePay}
          disabled={!isValidAmount || paying}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {paying ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              处理中...
            </>
          ) : (
            <>支付宝支付 {isValidAmount ? formatCurrency(effectiveAmount, CURRENCY) : ''}</>
          )}
        </button>

        {/* Hidden container for Alipay form injection */}
        <div ref={formContainerRef} className="hidden" />
      </section>

      {/* Order History */}
      <section>
        <h3 className="mb-3 text-sm font-medium text-gray-700">充值记录</h3>
        {loading ? (
          <div className="h-40 animate-pulse rounded-lg bg-gray-100" />
        ) : error ? (
          <ErrorBanner message={error} />
        ) : orders.length === 0 ? (
          <EmptyState title="暂无充值记录。" />
        ) : (
          <div className="overflow-hidden rounded-lg bg-white ring-1 ring-inset ring-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#edf2f7] text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">订单号</th>
                    <th className="px-6 py-4 font-medium">金额</th>
                    <th className="px-6 py-4 font-medium">状态</th>
                    <th className="px-6 py-4 font-medium">支付渠道</th>
                    <th className="px-6 py-4 font-medium">支付时间</th>
                    <th className="px-6 py-4 font-medium">备注</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const statusMeta = orderStatusLabel(order.status)
                    return (
                      <tr key={order.id} className="border-t border-gray-100 text-gray-700">
                        <td className="px-6 py-5 text-sm">{order.order_no}</td>
                        <td className="px-6 py-5 text-sm">{formatCurrency(order.amount, CURRENCY)}</td>
                        <td className="px-6 py-5">
                          <span className={`rounded-full px-2.5 py-1 text-xs ${statusMeta.tone}`}>{statusMeta.label}</span>
                        </td>
                        <td className="px-6 py-5 text-sm">{order.payment_channel_label}</td>
                        <td className="px-6 py-5 text-sm">{formatDateTime(order.paid_at)}</td>
                        <td className="px-6 py-5 text-sm text-gray-500">{order.remark || '-'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <Pagination page={page - 1} totalPages={totalPages} onPageChange={(p) => setPage(p + 1)} />
            )}
          </div>
        )}
      </section>
    </div>
  )
}
