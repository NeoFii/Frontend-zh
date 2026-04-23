'use client'

import { useState } from 'react'
import { mutate } from 'swr'
import { redeemVoucher, type VoucherRedeemResult } from '@/lib/api/router'
import { formatCurrency } from '@/lib/router-analytics'
import { extractErrorMessage } from '@/lib/error'
import ConsolePageHeader from '@/components/ui/ConsolePageHeader'

const CURRENCY = 'CNY'

export default function VoucherPage() {
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<VoucherRedeemResult | null>(null)
  const [error, setError] = useState<string | null>(null)

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
      mutate('router-balance')
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
    </div>
  )
}
