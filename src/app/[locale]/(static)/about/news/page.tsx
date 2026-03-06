import { fetchNewsListFromApi } from '@/lib/api/news'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import NewsGrid from './NewsGrid'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'aboutNews' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function NewsPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'aboutNews' })
  const { items: newsList } = await fetchNewsListFromApi(1, 20)

  return (
    <div className="animate-fade-in">
      {/* Page Header - 简洁白色设计 */}
      <div className="relative bg-white pt-24 pb-12 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{t('title')}</h1>
            <p className="text-lg text-gray-600">{t('description')}</p>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <NewsGrid newsList={newsList} />
        </div>
      </section>
    </div>
  )
}
