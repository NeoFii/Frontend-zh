import { notFound } from 'next/navigation'
import Image from 'next/image'
import { fetchNewsDetailFromApi, fetchAllNewsSlugs } from '@/lib/api/news'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import type { Metadata } from 'next'
import { getTranslation } from '@/lib/translations'

// 强制动态渲染，消除 DYNAMIC_SERVER_USAGE 错误
export const dynamic = 'force-dynamic'
// 允许动态渲染未预生成的路径
export const dynamicParams = true

// 预生成静态页面参数
export async function generateStaticParams() {
  const slugs = await fetchAllNewsSlugs()
  return slugs.map((slug: string) => ({ slug }))
}

// 生成页面元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { t } = getTranslation('errors')
  const news = await fetchNewsDetailFromApi(params.slug)

  if (!news) {
    return {
      title: t('notFound'),
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
export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = await fetchNewsDetailFromApi(params.slug)

  if (!news) {
    notFound()
  }

  return (
    <main className="flex flex-col items-center w-full overflow-y-auto flex-1 pb-[120px] min-h-screen bg-white">
      {/* 标题区域 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[768px] pt-[80px]">
        {/* 主标题 */}
        <h1 className="text-[#181E25] text-[40px] md:text-[48px] font-[500] leading-[1.6] text-center mb-[16px]">
          {news.title}
        </h1>

        {/* 日期 */}
        <div className="text-[#666666] text-[14px] font-[400] leading-[21px] text-center mb-[48px]">
          {news.date}
        </div>
      </div>

      {/* 封面图 */}
      {news.coverImage && (
        <div className="w-full px-[20px] lg:px-0 lg:w-[768px] mb-[48px]">
          <div className="relative aspect-video w-full">
            <Image
              src={news.coverImage}
              alt={news.title}
              fill
              className="object-cover rounded-[12px]"
              priority
            />
          </div>
        </div>
      )}

      {/* 正文内容 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[768px]">
        <MarkdownRenderer content={news.content} />
      </div>
    </main>
  )
}
