import { notFound } from 'next/navigation'
import { getAllProducts, getProductBySlug } from '@/lib/cms'
import ProductDetailClient from './ProductDetailClient'
import type { Metadata } from 'next'
import { getTranslation } from '@/lib/translations'

// 生成所有静态路径
export async function generateStaticParams() {
  const products = getAllProducts('en')
  const slugs = products.map((product) => product.slug)
  return slugs.map((slug) => ({ slug }))
}

// 生成页面元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { t } = getTranslation('errors')
  const product = getProductBySlug(params.slug, 'en')

  if (!product) {
    return {
      title: t('notFound'),
    }
  }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      type: 'website',
      images: product.image ? [{ url: product.image }] : [],
    },
  }
}

// 页面组件（服务端组件）
export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug, 'en')

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
