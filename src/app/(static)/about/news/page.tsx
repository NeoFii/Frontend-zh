import { getAllNews } from '@/lib/cms'
import type { Metadata } from 'next'
import NewsGrid from './NewsGrid'

export const metadata: Metadata = {
  title: '最新资讯',
  description: '了解公司最新动态与行业资讯',
}

export default function NewsPage() {
  const newsList = getAllNews()

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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">最新资讯</h1>
            <p className="text-lg text-gray-600">了解公司最新动态与行业资讯</p>
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
