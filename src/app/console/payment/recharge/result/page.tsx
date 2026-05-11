'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { fetchAlipayOrderStatus } from '@/lib/api/router'
import { formatCurrency } from '@/lib/router-analytics'
import ConsolePageHeader from '@/components/ui/ConsolePageHeader'

type Status = 'polling' | 'success' | 'timeout'

const POLL_INTERVAL = 2000
const MAX_POLLS = 15

export default function RechargeResultPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNo = searchParams.get('order_no') ?? ''
  const [status, setStatus] = useState<Status>('polling')
  const [amount, setAmount] = useState<number>(0)
  const pollCount = useRef(0)

  useEffect(() => {
    if (!orderNo) {
      setStatus('timeout')
      return
    }

    const timer = setInterval(async () => {
      pollCount.current += 1
      try {
        const data = await fetchAlipayOrderStatus(orderNo)
        if (data.status === 2) {
          setAmount(data.amount / 1_000_000)
          setStatus('success')
          clearInterval(timer)
        } else if (pollCount.current >= MAX_POLLS) {
          setStatus('timeout')
          clearInterval(timer)
        }
      } catch {
        if (pollCount.current >= MAX_POLLS) {
          setStatus('timeout')
          clearInterval(timer)
        }
      }
    }, POLL_INTERVAL)

    return () => clearInterval(timer)
  }, [orderNo])

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <ConsolePageHeader badge="PAYMENT" title="支付结果" description="" />

      <section className="flex flex-col items-center rounded-lg bg-white px-6 py-12 ring-1 ring-inset ring-gray-100">
        {status === 'polling' && (
          <>
            <svg className="mb-4 h-10 w-10 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-gray-600">正在确认支付结果...</p>
            <p className="mt-1 text-xs text-gray-400">订单号：{orderNo}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-800">充值成功</p>
            <p className="mt-1 text-sm text-gray-500">已到账 {formatCurrency(amount, 'CNY')}</p>
            <button
              onClick={() => router.push('/console/payment/recharge')}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              返回充值页
            </button>
          </>
        )}

        {status === 'timeout' && (
          <>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-800">支付确认中</p>
            <p className="mt-1 text-center text-sm text-gray-500">
              支付结果尚未确认，请稍后在充值记录中查看。<br />
              如已完成支付，余额将在几分钟内到账。
            </p>
            <button
              onClick={() => router.push('/console/payment/recharge')}
              className="mt-6 rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              查看充值记录
            </button>
          </>
        )}
      </section>
    </div>
  )
}
