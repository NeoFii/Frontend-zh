import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getAllNews, getNewsBySlug } from '@/lib/cms'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import type { Metadata } from 'next'

// 生成所有静态路径
export async function generateStaticParams() {
  const news = getAllNews()
  return news.map((item) => ({
    slug: item.slug,
  }))
}

// 生成页面元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const news = getNewsBySlug(params.slug)

  if (!news) {
    return {
      title: '新闻不存在',
    }
  }

  return {
    title: news.title,
    description: news.title,
    openGraph: {
      title: news.title,
      description: news.title,
      type: 'article',
      publishedTime: news.date,
      images: news.coverImage ? [{ url: news.coverImage }] : [],
    },
  }
}

// 页面组件（服务端组件）
export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = getNewsBySlug(params.slug)

  if (!news) {
    notFound()
  }

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <header className="pt-16 pb-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-[54px] font-medium text-gray-900 leading-tight lg:leading-[86.4px] text-center pb-8">
              {news.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{news.date}</span>
            </div>
          </header>

          {/* Cover Image */}
          {news.coverImage && (
            <div className="mb-10 relative aspect-video">
              <Image
                src={news.coverImage}
                alt={news.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          )}

          {/* Markdown Content */}
          <MarkdownRenderer content={news.content} />

        </div>
      </div>
    </div>
  )
}
