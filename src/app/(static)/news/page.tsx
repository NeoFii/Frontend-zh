import Link from 'next/link'
import Image from 'next/image'
import { getAllNews } from '@/lib/cms'
import type { Metadata } from 'next'

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
          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((news) => (
              <article
                key={news.slug}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer group"
              >
                <Link href={`/news/${news.slug}`} target="_blank" rel="noopener noreferrer">
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                    {news.coverImage ? (
                      <Image
                        src={news.coverImage}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <svg className="w-12 h-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                        {news.category}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {news.date}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination - 暂时隐藏，新闻数量增多后启用 */}
          {/* <div className="mt-8 flex justify-center">...</div> */}
        </div>
      </section>
    </div>
  )
}
