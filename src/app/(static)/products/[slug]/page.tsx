import { notFound } from 'next/navigation'
import { getAllProducts, getProductBySlug } from '@/lib/cms'
import ProductDetailClient from './ProductDetailClient'
import type { Metadata } from 'next'

// 生成所有静态路径
export async function generateStaticParams() {
  const products = getAllProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

// 生成页面元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = getProductBySlug(params.slug)

  if (!product) {
    return {
      title: '产品不存在',
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
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
