// 从后端 API 获取的新闻类型
export interface BackendNewsItem {
  uid: number
  title: string
  slug: string
  summary: string | null
  cover_image: string | null
  published_at: string | null
  content?: string
}

export interface BackendNewsListResponse {
  items: BackendNewsItem[]
  total: number
  page: number
  page_size: number
}

// 转换后端数据为前端格式
function transformNewsItem(item: BackendNewsItem) {
  return {
    slug: item.slug,
    title: item.title,
    date: item.published_at ? new Date(item.published_at).toLocaleDateString('zh-CN') : '',
    category: '',
    coverImage: item.cover_image || undefined,
    content: item.content || '',
  }
}

// 获取 API 基础 URL（自动适配服务端/客户端）
function getBaseUrl() {
  // 服务端：使用完整的后端地址
  if (typeof window === 'undefined') {
    // 优先使用环境变量配置的后端地址
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    // 组合 /api/v1 前缀
    return `${apiUrl}/api/v1`
  }
  // 客户端：使用相对路径（通过 Next.js 反向代理或直接访问）
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (baseUrl) {
    // 相对路径如 /api/v1
    return baseUrl
  }
  return 'http://localhost:8000/api/v1'
}

// 获取新闻列表（从后端 API）
export async function fetchNewsListFromApi(page = 1, pageSize = 20) {
  const baseUrl = getBaseUrl()
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  })
  const res = await fetch(`${baseUrl}/news?${params}`, {
    next: { revalidate: 3600 },
  })
  const json = await res.json()

  if (json.code !== 200) {
    return { items: [], total: 0 }
  }

  return {
    items: json.data.items.map(transformNewsItem),
    total: json.data.total,
  }
}

// 获取新闻详情（从后端 API）
export async function fetchNewsDetailFromApi(slug: string) {
  const baseUrl = getBaseUrl()
  try {
    const res = await fetch(`${baseUrl}/news/${slug}`, {
      next: { revalidate: 3600 },
    })
    const json = await res.json()

    if (json.code !== 200) {
      return null
    }

    return transformNewsItem(json.data)
  } catch (error) {
    // 网络错误或后端未运行时，返回 null 触发 404
    console.warn('[fetchNewsDetailFromApi] fetch failed:', error)
    return null
  }
}

// 获取所有已发布新闻的 slug（用于静态生成）
export async function fetchAllNewsSlugs() {
  const baseUrl = getBaseUrl()
  try {
    const res = await fetch(`${baseUrl}/news?page=1&page_size=100`, {
      next: { revalidate: 3600 },
    })
    const json = await res.json()

    if (json.code !== 200) {
      return []
    }

    return json.data.items.map((item: BackendNewsItem) => item.slug)
  } catch (error) {
    // 构建时后端可能未运行，返回空数组避免构建失败
    console.warn('[fetchAllNewsSlugs] fetch failed, returning empty array:', error)
    return []
  }
}
