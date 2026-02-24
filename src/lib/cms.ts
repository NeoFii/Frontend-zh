/**
 * CMS 内容管理工具库
 * 用于读取和解析 Markdown 内容文件
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type {
  NewsItem,
  ProductItem,
  NewsFrontmatter,
  ProductFrontmatter,
  CMSQueryParams,
  CMSQueryResult,
} from '@/types/cms'

// 内容目录路径
const CONTENT_DIR = path.join(process.cwd(), 'content')
const NEWS_DIR = path.join(CONTENT_DIR, 'news')
const PRODUCTS_DIR = path.join(CONTENT_DIR, 'products')

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
 * 获取所有新闻文章
 */
export function getAllNews(): NewsItem[] {
  ensureDirectoryExists(NEWS_DIR)

  const files = fs.readdirSync(NEWS_DIR)
  const markdownFiles = files.filter((file) => file.endsWith('.md'))

  const news = markdownFiles
    .map((filename) => {
      const filePath = path.join(NEWS_DIR, filename)
      const result = readMarkdownFile<NewsFrontmatter>(filePath)

      if (!result) return null

      const { data, content } = result
      const slug = generateSlug(filename)

      return {
        slug,
        title: data.title,
        date: data.date,
        category: data.category,
        coverImage: data.coverImage,
        content,
      } as NewsItem
    })
    .filter((item): item is NewsItem => item !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return news
}

/**
 * 根据 slug 获取单篇新闻
 */
export function getNewsBySlug(slug: string): NewsItem | null {
  const filePath = path.join(NEWS_DIR, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const result = readMarkdownFile<NewsFrontmatter>(filePath)

  if (!result) return null

  const { data, content } = result

  return {
    slug,
    title: data.title,
    date: data.date,
    category: data.category,
    coverImage: data.coverImage,
    content,
  } as NewsItem
}

/**
 * 查询新闻列表（支持分页和过滤）
 */
export function queryNews(params: CMSQueryParams = {}): CMSQueryResult<NewsItem> {
  const { limit = 10, offset = 0, category, sortBy = 'date', sortOrder = 'desc' } = params

  let items = getAllNews()

  // 分类过滤
  if (category) {
    items = items.filter((item) => item.category === category)
  }

  // 排序
  items.sort((a, b) => {
    let comparison = 0
    if (sortBy === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
    } else if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title)
    }
    return sortOrder === 'desc' ? -comparison : comparison
  })

  const total = items.length
  const paginatedItems = items.slice(offset, offset + limit)
  const hasMore = offset + limit < total

  return { items: paginatedItems, total, hasMore }
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
 * 获取最新新闻
 */
export function getLatestNews(limit: number = 3): NewsItem[] {
  return getAllNews().slice(0, limit)
}

/**
 * 获取所有新闻分类
 */
export function getNewsCategories(): string[] {
  const news = getAllNews()
  const categories = new Set(news.map((item) => item.category))
  return Array.from(categories)
}

/**
 * 获取所有产品分类
 */
export function getProductCategories(): string[] {
  const products = getAllProducts()
  const categories = new Set(products.map((item) => item.category).filter(Boolean))
  return Array.from(categories) as string[]
}
