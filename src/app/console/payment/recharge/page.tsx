'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function RechargePage() {
  const { t } = useTranslation('console.payment')

  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }}>
      <h2 className="text-xl font-normal text-gray-900 mb-6">{t('rechargePage.title')}</h2>
      <div className="divide-y divide-gray-100">
        {[
          { type: t('rechargePage.recharge'), amount: '+¥100.00', date: '2026-02-20', status: t('success') },
          { type: t('rechargePage.recharge'), amount: '+¥200.00', date: '2026-01-15', status: t('success') },
          { type: t('rechargePage.recharge'), amount: '+¥500.00', date: '2026-01-01', status: t('success') },
        ].map((item, index) => (
          <div key={index} className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-normal text-green-600">充</span>
              </div>
              <div>
                <p className="text-sm font-normal text-gray-900">{item.type}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-normal text-green-600">{item.amount}</span>
              <span className="text-sm text-gray-500">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
