'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function VoucherPage() {
  const { t } = useTranslation('console.payment')

  return (
    <div style={{ fontFamily: 'MiSans, sans-serif' }}>
      <h2 className="text-xl font-normal text-gray-900 mb-6">{t('voucherPage.title')}</h2>
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <p className="text-gray-500">{t('voucherPage.noVouchers')}</p>
        <p className="text-sm text-gray-400 mt-1">{t('voucherPage.activityHint')}</p>
      </div>
    </div>
  )
}
