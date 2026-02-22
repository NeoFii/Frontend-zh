# Eucal AI 官网架构设计文档

## 设计日期
2026-02-22

## 架构概述
采用 **SSG + ISR + CSR** 混合渲染模式，实现高性能静态站点与动态功能的平衡。

---

## 1. 页面渲染策略

### 1.1 新闻详情页 (`/news/[slug]`)

**渲染模式：** SSG (Static Site Generation)

**设计说明：**
- 新闻内容完全静态，发布后无需频繁修改
- 使用 Markdown 文件存储内容，构建时渲染为 HTML
- 所有图片预先存放在 `public/images/news/`
- 通过 `generateStaticParams` 在构建时生成所有新闻页面

**文件结构：**
```
content/news/
├── tierflow-2-0-release.md      # → /news/tierflow-2-0-release
├── strategic-partnership.md     # → /news/strategic-partnership
└── series-a-funding.md          # → /news/series-a-funding
```

**Markdown 格式：**
```markdown
---
title: "Eucal AI 发布 TierFlow 2.0，推理效率提升 40%"
date: "2024-01-15"
category: "产品动态"
author: "Eucal AI 团队"
coverImage: "/images/news/tierflow-2-0.jpg"
summary: "全新版本带来更智能的缓存策略和更精准的模型路由"
---

## 全新升级

TierFlow 2.0 带来了更智能的缓存策略...
```

---

### 1.2 首页 (`/`)

**渲染模式：** ISR (Incremental Static Regeneration)

**设计说明：**
- 产品矩阵、新闻列表等内容会随新产品发布而更新
- 设置 1 小时重新验证间隔，自动刷新内容
- 支持按需重新验证（Webhook 触发）

**配置：**
```typescript
export const revalidate = 3600 // 1小时
```

**数据来源：**
- 产品矩阵：Markdown 文件 `content/products/*.md`
- 最新新闻：取 `content/news/` 最新 3 篇

---

### 1.3 产品详情页 (`/products/[slug]`)

**渲染模式：** ISR

**设计说明：**
- 产品数据存储在 Markdown 中
- 设置较长的重新验证间隔（如 24 小时）
- 产品信息变化频率低

**文件结构：**
```
content/products/
└── tierflow.md                  # → /products/tierflow
```

---

### 1.4 用户登录状态

**渲染模式：** CSR (Client-Side Rendering)

**设计说明：**
- Header 保持客户端组件
- 页面加载后异步获取用户状态
- 登录/注册页面保持 CSR（表单交互）

---

## 2. 目录结构

```
next/
├── content/                      # Markdown CMS 内容
│   ├── news/                     # 新闻文章
│   │   ├── tierflow-2-0-release.md
│   │   └── ...
│   ├── products/                 # 产品信息
│   │   └── tierflow.md
│   └── home/                     # 首页模块数据
│       └── features.md
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首页 (ISR)
│   │   ├── news/
│   │   │   ├── page.tsx          # 新闻列表 (ISR)
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 新闻详情 (SSG)
│   │   └── products/
│   │       └── [slug]/
│   │           └── page.tsx      # 产品详情 (ISR)
│   ├── lib/
│   │   └── cms.ts                # Markdown 读取工具
│   └── types/
│       └── cms.ts                # CMS 类型定义
└── public/
    └── images/
        ├── news/                 # 新闻封面图
        └── products/             # 产品图片
```

---

## 3. 核心模块设计

### 3.1 CMS 工具库 (`lib/cms.ts`)

**功能：**
- 读取 Markdown 文件
- 解析 frontmatter 元数据
- 渲染 Markdown 内容为 HTML/React

**接口：**
```typescript
// 获取所有新闻
getAllNews(): NewsItem[]

// 获取单篇新闻
getNewsBySlug(slug: string): NewsItem | null

// 获取所有产品
getAllProducts(): ProductItem[]

// 获取单个产品
getProductBySlug(slug: string): ProductItem | null
```

### 3.2 类型定义 (`types/cms.ts`)

```typescript
interface NewsItem {
  slug: string
  title: string
  date: string
  category: string
  author: string
  coverImage?: string
  summary: string
  content: string
}

interface ProductItem {
  slug: string
  name: string
  tagline: string
  description: string
  features: Feature[]
  stats: Stat[]
  content: string
}
```

---

## 4. 内容发布流程

### 4.1 添加新文章

1. 编写 Markdown 文件 → `content/news/new-article.md`
2. 添加封面图 → `public/images/news/new-article.jpg`
3. 提交代码 → 触发 CI/CD 构建
4. 自动重新生成静态页面

### 4.2 即时刷新（可选）

实现 API 路由用于按需重新验证：
```typescript
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const { slug } = await request.json()
  revalidatePath(`/news/${slug}`)
  return Response.json({ revalidated: true })
}
```

---

## 5. 性能目标

| 指标 | 目标值 |
|------|--------|
| 首字节时间 (TTFB) | < 100ms |
| 首屏加载时间 (FCP) | < 1.5s |
| 可交互时间 (TTI) | < 2s |
| Lighthouse 性能评分 | > 90 |

---

## 6. 技术依赖

```bash
# Markdown 处理
npm install gray-matter react-markdown remark-gfm

# 类型支持
npm install -D @types/gray-matter
```

---

## 7. 实施阶段

### 阶段 1：CMS 基础架构
- 创建 `content/` 目录结构
- 实现 `lib/cms.ts` 工具库
- 定义类型接口

### 阶段 2：新闻系统 SSG
- 迁移现有新闻到 Markdown
- 实现新闻详情页 SSG
- 实现新闻列表页 ISR

### 阶段 3：产品系统 ISR
- 迁移产品数据到 Markdown
- 实现产品详情页 ISR

### 阶段 4：首页 ISR
- 首页使用 ISR 模式
- 集成产品和新闻数据

### 阶段 5：优化与验证
- 性能测试
- SEO 验证
- 构建优化

---

## 批准记录

- [ ] 设计已审核
- [ ] 可以开始实施
