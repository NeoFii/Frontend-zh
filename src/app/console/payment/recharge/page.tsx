'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { extractErrorMessage } from '@/lib/error'
import { createAlipayPrecreate, fetchAlipayOrderStatus, fetchTopupOrders } from '@/lib/api/router'
import type { TopupOrderItem } from '@/lib/api/router'
import { formatCurrency, formatDateTime } from '@/lib/router-analytics'
import ConsolePageHeader from '@/components/ui/ConsolePageHeader'
import ErrorBanner from '@/components/ui/ErrorBanner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'

const CURRENCY = 'CNY'
const PAGE_SIZE = 10
const POLL_INTERVAL_MS = 2000
const POLL_MAX_ATTEMPTS = 90

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

type QrModalState = {
  open: boolean
  orderNo: string
  qrUrl: string
  amount: number
  status: 'pending' | 'success' | 'expired'
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

  const [qrModal, setQrModal] = useState<QrModalState>({
    open: false, orderNo: '', qrUrl: '', amount: 0, status: 'pending',
  })
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollCountRef = useRef(0)

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

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    pollCountRef.current = 0
  }, [])

  const startPolling = useCallback((orderNo: string) => {
    stopPolling()
    pollCountRef.current = 0
    pollRef.current = setInterval(async () => {
      pollCountRef.current += 1
      if (pollCountRef.current > POLL_MAX_ATTEMPTS) {
        stopPolling()
        setQrModal((prev) => ({ ...prev, status: 'expired' }))
        return
      }
      try {
        const res = await fetchAlipayOrderStatus(orderNo)
        if (res.status === 2) {
          stopPolling()
          setQrModal((prev) => ({ ...prev, status: 'success' }))
          fetchTopupOrders({ page: 1, page_size: PAGE_SIZE }).then((r) => {
            setOrders(r.data.items)
            setTotal(r.data.total)
            setPage(1)
          })
        }
      } catch {
        // ignore polling errors
      }
    }, POLL_INTERVAL_MS)
  }, [stopPolling])

  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  async function handlePay() {
    if (!isValidAmount || paying) return
    setPaying(true)
    setPayError(null)
    try {
      const microAmount = Math.round(effectiveAmount * 1_000_000)
      const res = await createAlipayPrecreate({ amount: microAmount, device: 'pc' })
      setQrModal({
        open: true,
        orderNo: res.order_no,
        qrUrl: res.qr_url,
        amount: effectiveAmount,
        status: 'pending',
      })
      startPolling(res.order_no)
    } catch (err) {
      setPayError(extractErrorMessage(err))
    } finally {
      setPaying(false)
    }
  }

  function closeModal() {
    stopPolling()
    setQrModal({ open: false, orderNo: '', qrUrl: '', amount: 0, status: 'pending' })
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
      </section>

      {/* QR Code Payment Modal */}
      {qrModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-[380px] rounded-2xl bg-white p-8 shadow-xl">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="关闭"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {qrModal.status === 'pending' && (
              <div className="flex flex-col items-center">
                <div className="mb-4 flex items-center gap-2">
                  <svg className="h-6 w-6 text-[#1677ff]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.422 15.358c-.347-.174-1.04-.521-1.387-.695a.5.5 0 0 0-.347 0c-.347.174-.694.521-1.04.695-.348.174-.695.174-1.042 0-.347-.174-.694-.521-1.04-.695a.5.5 0 0 0-.348 0c-.347.174-.694.521-1.04.695-.348.174-.695.174-1.042 0-.347-.174-.694-.521-1.04-.695a.5.5 0 0 0-.348 0c-.347.174-.694.521-1.04.695-.348.174-.695.174-1.042 0-.347-.174-.694-.521-1.04-.695a.5.5 0 0 0-.348 0c-.347.174-.694.521-1.04.695-.348.174-.695.174-1.042 0-.347-.174-.694-.521-1.04-.695a.5.5 0 0 0-.348 0c-.347.174-.694.521-1.04.695-.348.174-.695.174-1.042 0V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11.358zM5 17v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                  </svg>
                  <span className="text-base font-medium text-gray-800">支付宝扫码支付</span>
                </div>
                <p className="mb-5 text-2xl font-semibold text-gray-900">
                  ¥{qrModal.amount.toFixed(2)}
                </p>
                <div className="rounded-xl border border-gray-100 p-4">
                  <QRCodeSVG value={qrModal.qrUrl} size={200} level="M" />
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  请使用支付宝扫描二维码完成支付
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  等待支付结果...
                </div>
              </div>
            )}

            {qrModal.status === 'success' && (
              <div className="flex flex-col items-center py-4">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900">支付成功</p>
                <p className="mt-1 text-sm text-gray-500">¥{qrModal.amount.toFixed(2)} 已充值到账</p>
                <button
                  onClick={closeModal}
                  className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  完成
                </button>
              </div>
            )}

            {qrModal.status === 'expired' && (
              <div className="flex flex-col items-center py-4">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                  <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900">等待超时</p>
                <p className="mt-1 text-center text-sm text-gray-500">
                  未检测到支付结果，如已支付请稍后查看订单列表
                </p>
                <button
                  onClick={closeModal}
                  className="mt-6 rounded-lg bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  关闭
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
