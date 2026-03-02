'use client'

import { useTranslations } from 'next-intl'

export default function BillingHistoryPage() {
  const t = useTranslations('console.payment')

  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }}>
      <h2 className="text-xl font-normal text-gray-900 mb-6">{t('billingHistoryPage.title')}</h2>
      <div className="divide-y divide-gray-100">
        {[
          { type: t('billingHistoryPage.consumption'), amount: '-¥12.50', date: '2026-02-19' },
          { type: t('billingHistoryPage.consumption'), amount: '-¥8.30', date: '2026-02-18' },
          { type: t('billingHistoryPage.consumption'), amount: '-¥15.20', date: '2026-02-17' },
        ].map((item, index) => (
          <div key={index} className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-normal text-orange-600">消</span>
              </div>
              <div>
                <p className="text-sm font-normal text-gray-900">{item.type}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            </div>
            <span className="text-sm font-normal text-gray-900">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
