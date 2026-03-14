'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// 新闻数据类型（API 返回格式）
type NewsItem = {
  slug: string
  title: string
  date: string
  category: string
  coverImage?: string
  content: string
}

interface NewsGridProps {
  newsList: NewsItem[]
}

const INITIAL_COUNT = 6
const LOAD_MORE_COUNT = 6

export default function NewsGrid({ newsList }: NewsGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)

  const visibleNews = newsList.slice(0, visibleCount)
  const hasMore = visibleCount < newsList.length

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + LOAD_MORE_COUNT)
  }

  if (newsList.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">暂时还没有新闻哦</h3>
        <p className="mx-auto max-w-xl text-sm leading-6 text-gray-500">
          我们正在准备最新动态、产品更新和行业内容。稍后再来看看，这里会第一时间展示新的新闻内容。
        </p>
      </div>
    )
  }

  return (
    <>
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleNews.map((news) => (
          <article
            key={news.slug}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer group"
          >
            <Link href={`/about/news/${news.slug}`} target="_blank" rel="noopener noreferrer">
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

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
          >
            加载更多
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
