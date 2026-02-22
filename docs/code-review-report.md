# Vue 迁移到 Next.js 代码审查报告

## 概述

本报告审查从 Vue 3 + Pinia + Vue Router 迁移到 Next.js 14 + React + Zustand 的代码库，基于**混合架构**方案进行分析和建议。

**架构决策：**
- **静态内容（SSG）**：新闻、产品、关于我们等营销页面，使用 Markdown CMS
- **动态内容（SSR）**：登录、注册、开放平台等需要后端 API 的功能

---

## 1. 确定的混合架构方案

### 1.1 推荐的目录结构

```
next/
├── src/
│   ├── app/
│   │   ├── (static)/           # 静态内容组（SSG）
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── about/
│   │   │   ├── news/
│   │   │   ├── products/
│   │   │   └── layout.tsx      # 包含 Header/Footer
│   │   │
│   │   ├── (dynamic)/          # 动态内容组（SSR）
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── platform/       # 开放平台（需要登录态）
│   │   │   └── layout.tsx      # 不包含 Footer（全屏）
│   │   │
│   │   ├── layout.tsx          # 根布局
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                 # 基础 UI 组件
│   │   └── layout/             # 布局组件
│   │
│   ├── lib/
│   │   ├── cms.ts              # 静态内容获取（保留）
│   │   └── api/                # 动态 API（保留）
│   │       ├── index.ts        # API 客户端配置
│   │       ├── auth.ts         # 登录/注册 API
│   │       └── platform.ts     # 开放平台 API
│   │
│   ├── stores/
│   │   └── auth.ts             # 用户认证状态（仅保留此文件）
│   │
│   └── types/
│       ├── index.ts            # 统一导出
│       ├── cms.ts              # CMS 相关类型
│       └── api.ts              # API 相关类型
│
├── content/                    # Markdown 静态内容
│   ├── news/
│   └── products/
│
└── next.config.ts              # 单一配置文件
```

### 1.2 路由组说明

#### (static) - 静态内容组

**特点：**
- 使用 SSG（静态站点生成）
- 构建时从 `lib/cms.ts` 获取内容
- 包含 Header 和 Footer
- 适合内容型页面

**包含页面：**
```typescript
// app/(static)/layout.tsx
export default function StaticLayout({ children }) {
  return (
    <>
      <AppHeader />
      <main className="flex-1 pt-20">{children}</main>
      <AppFooter />
    </>
  )
}
```

#### (dynamic) - 动态内容组

**特点：**
- 使用 SSR（服务端渲染）或客户端渲染
- 调用后端 API 获取数据
- 不包含 Footer（全屏布局）
- 需要用户认证状态

**包含页面：**
```typescript
// app/(dynamic)/layout.tsx
export default function DynamicLayout({ children }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
```

---

## 2. 需要修复的问题

### 2.1 高优先级（必须修复）

#### 1. 删除重复的配置文件

**问题：** 同时存在 `next.config.ts` 和 `next.config.mjs`

**操作：**
```bash
rm next.config.mjs
```

#### 2. 修复 404 页面的未定义 CSS 类

**问题：** `app/not-found.tsx` 使用了未定义的 `btn-primary`、`btn-secondary`

**修复：**
```tsx
// app/not-found.tsx
<Link href="/" className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
  返回首页
</Link>
<button
  onClick={() => window.history.back()}
  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
>
  返回上一页
</button>
```

#### 3. 替换原生 img 为 Next.js Image 组件

**问题：** 新闻详情页使用原生 `<img>` 标签

**修复：**
```tsx
import Image from 'next/image'

// 替换
<img src={news.coverImage} alt={news.title} />

// 为
<Image
  src={news.coverImage}
  alt={news.title}
  width={800}
  height={400}
  className="rounded-lg"
/>
```

**注意：** 需要在 `next.config.ts` 中添加图片域名配置：
```typescript
const nextConfig = {
  images: {
    domains: ['your-cdn-domain.com'],
  },
  // ...
}
```

#### 4. 统一类型定义

**问题：** `ProductItem` 和 `NewsItem` 在 `types/index.ts` 和 `types/cms.ts` 中重复定义且不一致

**解决方案：**

```typescript
// types/cms.ts - CMS 专用类型
export interface CMSNewsItem {
  slug: string
  title: string
  date: string
  category: string
  coverImage?: string
  content: string
}

export interface CMSProductItem {
  slug: string
  id: number
  name: string
  tagline: string
  short_description: string
  full_description: string
  // ... 其他 CMS 字段
  content: string
}

// types/index.ts - 统一导出
export type { CMSNewsItem as NewsItem, CMSProductItem as ProductItem } from './cms'
export * from './api'
```

### 2.2 中优先级（建议修复）

#### 5. 删除未使用的 Store 文件

**需要删除：**
```bash
rm src/stores/app.ts
rm src/stores/news.ts
rm src/stores/products.ts
```

**保留并优化：**
```typescript
// stores/auth.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (token, user) => set({ isAuthenticated: true, token, user }),
      logout: () => set({ isAuthenticated: false, token: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
```

#### 6. 移除或替换 rehypeRaw 插件

**问题：** `react-markdown` 使用 `rehypeRaw` 存在 XSS 风险

**建议：** 如果不需要渲染原始 HTML，移除该插件：
```tsx
<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {content}
</ReactMarkdown>
```

#### 7. 提取硬编码数据

**问题：** `page.tsx`（首页）包含大量硬编码的备用数据

**建议：** 创建默认数据配置文件：
```typescript
// lib/default-data.ts
export const defaultStats = [
  { label: '成本降低', value: '70', suffix: '%' },
  { label: '平均响应', value: '50', suffix: 'ms' },
  { label: '服务可用性', value: '99.9', suffix: '%' },
]

export const defaultHighlights = [
  // ...
]
```

---

## 3. 具体页面迁移指南

### 3.1 静态页面（SSG）

#### 首页 - app/(static)/page.tsx

```typescript
import { getAllProducts } from '@/lib/cms'
import Link from 'next/link'

export default function HomePage() {
  const products = getAllProducts()
  const featuredProduct = products[0]

  return (
    <div>
      {/* Hero Section */}
      <section>...</section>

      {/* Features Section */}
      <section>...</section>
    </div>
  )
}
```

#### 新闻列表 - app/(static)/news/page.tsx

```typescript
import { getAllNews } from '@/lib/cms'
import Link from 'next/link'

export const metadata = {
  title: '最新资讯',
  description: '了解公司最新动态与行业资讯',
}

export default function NewsPage() {
  const newsList = getAllNews()

  return (
    <div>
      <h1>最新资讯</h1>
      <div className="grid grid-cols-3 gap-6">
        {newsList.map((news) => (
          <article key={news.slug}>
            <Link href={`/news/${news.slug}`}>
              {/* ... */}
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
```

#### 新闻详情 - app/(static)/news/[slug]/page.tsx

```typescript
import { getAllNews, getNewsBySlug } from '@/lib/cms'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export async function generateStaticParams() {
  const news = getAllNews()
  return news.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const news = getNewsBySlug(params.slug)
  return { title: news?.title || '新闻不存在' }
}

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = getNewsBySlug(params.slug)

  if (!news) notFound()

  return (
    <article>
      <h1>{news.title}</h1>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {news.content}
      </ReactMarkdown>
    </article>
  )
}
```

### 3.2 动态页面（SSR/Client）

#### 登录页 - app/(dynamic)/login/page.tsx

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'
import { login as loginApi } from '@/lib/api/auth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { token, user } = await loginApi(form)
      login(token, user)
      router.push('/platform')
    } catch (error) {
      // 处理错误
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* 左侧品牌区域 */}
      <div className="hidden lg:flex lg:w-1/2">
        {/* ... */}
      </div>

      {/* 右侧表单区域 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <form onSubmit={handleSubmit}>
          {/* ... */}
        </form>
      </div>
    </div>
  )
}
```

#### 开放平台 - app/(dynamic)/platform/page.tsx

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'

export default function PlatformPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div>
      <h1>开放平台</h1>
      {/* 平台功能 */}
    </div>
  )
}
```

---

## 4. API 层设计

### 4.1 认证 API

```typescript
// lib/api/auth.ts
import { http } from './index'

interface LoginParams {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: number
    email: string
    name: string
  }
}

export function login(params: LoginParams): Promise<LoginResponse> {
  return http.post('/auth/login', params)
}

export function register(params: {
  email: string
  password: string
  name: string
}): Promise<LoginResponse> {
  return http.post('/auth/register', params)
}
```

### 4.2 开放平台 API

```typescript
// lib/api/platform.ts
import { http } from './index'

export function fetchPlatformData() {
  return http.get('/platform/data')
}

export function fetchUserStats() {
  return http.get('/platform/stats')
}
```

---

## 5. 环境变量配置

### .env.local

```bash
# 公共变量（客户端可用）
NEXT_PUBLIC_COMPANY_NAME=Eucal AI
NEXT_PUBLIC_API_BASE_URL=/api/v1

# 服务端变量
API_SECRET_KEY=your-secret-key
REVALIDATE_SECRET=your-revalidate-secret
```

---

## 6. 迁移检查清单

### 第一阶段：清理和修复
- [ ] 删除 `next.config.mjs`
- [ ] 删除 `stores/app.ts`、`stores/news.ts`、`stores/products.ts`
- [ ] 修复 `not-found.tsx` 的 CSS 类
- [ ] 替换所有 `<img>` 为 `<Image>`
- [ ] 统一类型定义

### 第二阶段：路由重组
- [ ] 创建 `app/(static)/` 目录
- [ ] 将首页、关于、新闻、产品页面移至 `(static)`
- [ ] 创建 `app/(static)/layout.tsx`（含 Header/Footer）
- [ ] 创建 `app/(dynamic)/` 目录
- [ ] 将登录、注册、平台页面移至 `(dynamic)`
- [ ] 创建 `app/(dynamic)/layout.tsx`（全屏，无 Footer）

### 第三阶段：功能完善
- [ ] 实现 `stores/auth.ts`
- [ ] 实现 `lib/api/auth.ts`
- [ ] 实现 `lib/api/platform.ts`
- [ ] 添加登录状态检查（路由守卫）
- [ ] 添加错误处理

### 第四阶段：测试和优化
- [ ] 测试所有静态页面渲染
- [ ] 测试登录/注册流程
- [ ] 测试平台页面权限控制
- [ ] 优化性能（图片、代码分割）

---

## 7. 后续建议

### 不需要 ISR（现阶段）

因为你的 Markdown 文件通过 Git 管理，每次更新都需要重新部署，所以**不需要 ISR**。部署时已经重新生成了所有页面。

### 后续如果需要管理后台

如果未来需要添加内容管理后台，可以考虑：
1. 添加 ISR 配置：`export const revalidate = 600`
2. 添加 On-Demand Revalidation API
3. 或者直接使用 Headless CMS（如 Strapi）

### 安全建议

1. **移除 `rehypeRaw`**：避免 XSS 风险
2. **添加 CSRF 保护**：后端 API 需要 CSRF Token
3. **输入验证**：使用 Zod 验证表单输入
4. **HTTPS**：生产环境强制 HTTPS

---

## 8. 总结

### 架构核心

```
┌─────────────────────────────────────────────────────┐
│                    混合架构                          │
├──────────────────────┬──────────────────────────────┤
│     静态内容 (SSG)    │       动态内容 (SSR)          │
├──────────────────────┼──────────────────────────────┤
│ • 新闻               │ • 登录/注册                  │
│ • 产品               │ • 开放平台                    │
│ • 关于我们            │ • 用户中心                    │
├──────────────────────┼──────────────────────────────┤
│ 数据源: lib/cms.ts   │ 数据源: lib/api/*            │
│ 布局: 含 Header/Footer│ 布局: 全屏（无 Footer）       │
│ 状态: 无             │ 状态: stores/auth.ts          │
└──────────────────────┴──────────────────────────────┘
```

### 关键决策

1. **保留 CMS**：用于静态内容（新闻、产品）
2. **保留 API**：用于动态功能（登录、开放平台）
3. **精简 Store**：只保留 `auth.ts`，删除其他 store
4. **不使用 ISR**：现阶段通过 Git 更新内容，不需要 ISR

这个架构既满足了当前静态内容展示的需求，又为未来的动态功能扩展预留了空间。

---

*报告更新时间：2026-02-22*
*架构版本：混合架构 v1.0*
