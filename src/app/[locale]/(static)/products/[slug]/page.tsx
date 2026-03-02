import { notFound } from 'next/navigation'
import { getAllProducts, getProductBySlug } from '@/lib/cms'
import ProductDetailClient from './ProductDetailClient'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

// 生成所有静态路径
export async function generateStaticParams() {
  const products = getAllProducts('en')
  const slugs = products.map((product) => product.slug)
  // 为每个 locale 生成路径
  const paths: { locale: string; slug: string }[] = []
  for (const slug of slugs) {
    paths.push({ locale: 'zh', slug })
    paths.push({ locale: 'en', slug })
  }
  return paths
}

// 生成页面元数据
export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'errors' })
  const product = getProductBySlug(params.slug, params.locale)

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
export default function ProductDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const product = getProductBySlug(params.slug, params.locale)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
