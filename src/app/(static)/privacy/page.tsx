/**
 * 隐私政策页面
 */

import { getTranslation } from '@/lib/translations'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = getTranslation('legal')

  return {
    title: `${t('privacy.title')} - Eucal AI`,
    description: t('privacy.description'),
  }
}

export default async function PrivacyPage() {
  const { t } = getTranslation('legal')

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('privacy.title')}</h1>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('privacy.section1.title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t('privacy.section1.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('privacy.section2.title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t('privacy.section2.content')}
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>{t('privacy.section2.item1')}</li>
              <li>{t('privacy.section2.item2')}</li>
              <li>{t('privacy.section2.item3')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('privacy.section3.title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t('privacy.section3.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('privacy.section4.title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t('privacy.section4.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('privacy.section5.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('privacy.section5.content')}
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <p>{t('privacy.lastUpdated')}: 2026-01-01</p>
        </div>
      </div>
    </div>
  )
}
