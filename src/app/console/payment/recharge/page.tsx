'use client'

import { useEffect, useState } from 'react'
import { fetchTopupOrders } from '@/lib/api/router'
import type { TopupOrderItem } from '@/lib/api/router'
import { formatCurrency, formatDateTime } from '@/lib/router-analytics'

const CURRENCY = 'CNY'
const PAGE_SIZE = 20

function orderStatusLabel(status: number) {
  switch (status) {
    case 1: return { label: '待支付', tone: 'bg-amber-50 text-amber-700' }
    case 2: return { label: '已支付', tone: 'bg-emerald-50 text-emerald-700' }
    case 3: return { label: '已取消', tone: 'bg-gray-100 text-gray-500' }
    case 4: return { label: '已退款', tone: 'bg-blue-50 text-blue-700' }
    default: return { label: '未知', tone: 'bg-gray-100 text-gray-500' }
  }
}

export default function RechargePage() {
  const [orders, setOrders] = useState<TopupOrderItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  useEffect(() => {
    setLoading(true)
    fetchTopupOrders({ page, page_size: PAGE_SIZE })
      .then((res) => {
        setOrders(res.data.items)
        setTotal(res.data.total)
        setError(null)
      })
      .catch(() => setError('加载充值记录失败'))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_32%),linear-gradient(145deg,#ffffff_0%,#f8fafc_100%)] p-8 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.22)]">
        <div className="inline-flex rounded-full bg-gray-950 px-3 py-1 text-xs font-medium tracking-[0.24em] text-white">
          PAYMENT
        </div>
        <h2 className="mt-5 text-[1.75rem] tracking-tight text-gray-950">充值记录</h2>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          在线充值功能开发中，以下展示历史充值订单记录。
        </p>
      </section>

      {loading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-gray-500">
          暂无充值记录。
        </div>
      ) : (
        <section className="overflow-hidden rounded-xl bg-white ring-1 ring-inset ring-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#edf2f7] text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">订单号</th>
                  <th className="px-6 py-4 font-medium">金额</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium">支付渠道</th>
                  <th className="px-6 py-4 font-medium">支付时间</th>
                  <th className="px-6 py-4 font-medium">创建时间</th>
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
                      <td className="px-6 py-5 text-sm">{order.payment_channel}</td>
                      <td className="px-6 py-5 text-sm">{formatDateTime(order.paid_at)}</td>
                      <td className="px-6 py-5 text-sm">{formatDateTime(order.created_at)}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{order.remark || '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
              >
                上一页
              </button>
              <span className="text-sm text-gray-500">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
              >
                下一页
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
