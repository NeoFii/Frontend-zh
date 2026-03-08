'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function NotFound() {
  const { t } = useTranslation('errors')

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="text-center px-4">
        <div className="text-9xl font-bold text-gray-900 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('notFound')}</h1>
        <p className="text-xl text-gray-600 mb-8">{t('notFoundDesc')}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            {t('backHome')}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('backPrevious')}
          </button>
        </div>
      </div>
    </div>
  )
}
