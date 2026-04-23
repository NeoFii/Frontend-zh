'use client'

import { useEffect, useState } from 'react'
import { fetchTopupOrders } from '@/lib/api/router'
import type { TopupOrderItem } from '@/lib/api/router'
import { formatCurrency, formatDateTime } from '@/lib/router-analytics'
import ConsolePageHeader from '@/components/ui/ConsolePageHeader'
import ErrorBanner from '@/components/ui/ErrorBanner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'

const CURRENCY = 'CNY'
const PAGE_SIZE = 10

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
      <ConsolePageHeader badge="PAYMENT" title="充值记录" description="在线充值功能开发中，以下展示历史充值订单记录。" />

      {loading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
      ) : error ? (
        <ErrorBanner message={error} />
      ) : orders.length === 0 ? (
        <EmptyState title="暂无充值记录。" />
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
            <Pagination page={page - 1} totalPages={totalPages} onPageChange={(p) => setPage(p + 1)} />
          )}
        </section>
      )}
    </div>
  )
}
