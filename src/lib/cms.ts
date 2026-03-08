/**
 * CMS 内容管理工具库
 * 用于读取和解析 Markdown 内容文件
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type {
  ProductItem,
  ProductFrontmatter,
} from '@/types/cms'

// 内容目录路径
const PRODUCTS_DIR = path.join(process.cwd(), 'content', 'products')

/**
 * 确保目录存在
 */
function ensureDirectoryExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * 从文件名生成 slug
 */
function generateSlug(filename: string): string {
  return filename.replace(/\.md$/, '')
}

/**
 * 读取 Markdown 文件并解析 frontmatter
 */
function readMarkdownFile<T>(filePath: string): { data: T; content: string } | null {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    return { data: data as T, content }
  } catch {
    // 文件读取失败，返回 null
    return null
  }
}

/**
 * 获取所有产品
 */
export function getAllProducts(): ProductItem[] {
  ensureDirectoryExists(PRODUCTS_DIR)

  const files = fs.readdirSync(PRODUCTS_DIR)
  const markdownFiles = files.filter((file) => file.endsWith('.md'))

  const products = markdownFiles
    .map((filename) => {
      const filePath = path.join(PRODUCTS_DIR, filename)
      const result = readMarkdownFile<ProductFrontmatter>(filePath)

      if (!result) return null

      const { data, content } = result
      const slug = generateSlug(filename)

      return {
        slug,
        ...data,
        description: data.shortDescription,
        content,
      } as ProductItem
    })
    .filter((item): item is ProductItem => item !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return products
}

/**
 * 根据 slug 获取单个产品
 */
export function getProductBySlug(slug: string): ProductItem | null {
  const filePath = path.join(PRODUCTS_DIR, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const result = readMarkdownFile<ProductFrontmatter>(filePath)

  if (!result) return null

  const { data, content } = result

  return {
    slug,
    ...data,
    description: data.shortDescription,
    content,
  } as ProductItem
}

/**
 * 获取活跃的产品列表
 */
export function getActiveProducts(): ProductItem[] {
  return getAllProducts().filter((product) => product.isActive)
}

/**
 * 获取所有产品分类
 */
export function getProductCategories(): string[] {
  const products = getAllProducts()
  const categories = new Set(products.map((item) => item.category).filter(Boolean))
  return Array.from(categories) as string[]
}
