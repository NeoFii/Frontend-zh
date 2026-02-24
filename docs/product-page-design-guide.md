# 产品服务页面设计规范

## 概述

本文档定义了 Eucal AI 产品服务详情页面的设计规范，基于 MiniMax 官网设计风格。适用于新建产品服务页面时参考使用。

## 设计风格

- **布局**: 居中对齐，最大宽度 1000px/768px
- **配色**:
  - 主文字色: `#181E25` (深色)
  - 背景色: `#F7F8FA` (浅灰)
  - 辅助文字: `#666`
- **字体**: 使用系统字体，字重 300/400/500
- **间距**: 使用 Tailwind 间距系统，如 `mb-[24px]`, `py-[48px]`
- **圆角**: 卡片圆角 `rounded-[12px]` 或 `rounded-[16px]`
- **按钮**: 圆角胶囊按钮 `rounded-full`

---

## 页面结构

### 1. 标题区域

```tsx
<div className="px-[20px] lg:px-0 lg:w-[1000px] flex flex-col items-center mt-[80px]">
  {/* 主标题 */}
  <h1 className="m-0 p-0 text-center text-[#181E25] text-[54px] font-[500] leading-[86.4px] pb-[12px] max-w-[900px]">
    {product.name} - {product.tagline}
  </h1>

  {/* 日期 (可选) */}
  <div className="text-[#181E25] text-[14px] font-[400] leading-[21px] mb-[24px]">
    {product.createdAt || '2026-02-24'}
  </div>

  {/* CTA 按钮 */}
  <div className="flex items-center justify-center py-[16px]">
    <Link href="/login" className="no-underline p-[8px_24px] rounded-full flex items-center gap-2 bg-[#181E25] text-white mr-[16px] hover:opacity-90 transition-all duration-300">
      立即体验
    </Link>
    <Link href={`/products/${product.slug}`} className="no-underline p-[8px_24px] rounded-full flex items-center gap-2 border border-solid border-[#181E25]/80 text-[#181E25] hover:bg-[#F7F8FA] transition-all duration-300">
      了解更多
    </Link>
  </div>
</div>
```

### 2. 核心数据展示

```tsx
<div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[48px]">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
    {stats.map((stat, index) => (
      <div key={index} className="text-center p-8 bg-[#F7F8FA] rounded-[12px]">
        <div className="text-[36px] font-[500] text-[#181E25] mb-2">
          {stat.value}<span style={{ fontSize: '24px' }}>{stat.suffix}</span>
        </div>
        <div className="text-[14px] text-[#666]">{stat.label}</div>
      </div>
    ))}
  </div>
</div>
```

### 3. 产品简介

```tsx
<div className="w-full px-[20px] lg:px-0 lg:w-[768px]">
  <p className="m-0 p-0 text-[#181E25] text-[18px] font-[300] leading-[32px] text-center mb-[48px]">
    {product.shortDescription}
  </p>
</div>
```

### 4. 核心能力

```tsx
<div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[32px]">
  <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">核心能力</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {highlights.map((highlight, index) => (
      <div key={index} className="p-8 bg-[#F7F8FA] rounded-[16px] hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
            <Icon />
          </div>
          <div>
            <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">{highlight.title}</h3>
            <p className="text-[14px] text-[#666] leading-[24px]">{highlight.description}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

### 5. 使用场景

```tsx
<div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[48px]">
  <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">应用场景</h2>

  <div className="space-y-8">
    {useCases.map((useCase, index) => (
      <div key={index} className="bg-[#F7F8FA] rounded-[16px] p-8 md:p-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-[#181E25] text-white text-[14px] rounded-full">
            场景 {index + 1}
          </span>
        </div>
        <h3 className="text-[24px] font-[500] text-[#181E25] mb-4">{useCase.title}</h3>
        <p className="text-[16px] text-[#666] leading-[28px] mb-6">{useCase.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {useCase.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#181E25] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[14px] text-[#181E25]">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>
```

### 6. 详细内容 (Markdown)

```tsx
<div className="w-full px-[20px] lg:px-0 lg:w-[768px] py-[48px]">
  <MarkdownRenderer content={product.content} className="prose" />
</div>
```

### 7. 常见问题 (FAQ)

```tsx
<div className="w-full px-[20px] lg:px-0 lg:w-[768px] py-[48px]">
  <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">常见问题</h2>

  <div className="space-y-4">
    {faqs.map((faq, index) => {
      const isExpanded = expandedFaqs.includes(faq.id)

      return (
        <div key={index} className="bg-[#F7F8FA] rounded-[12px] overflow-hidden">
          <button
            onClick={() => toggleFaq(faq.id)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-[#F0F1F2] transition-colors"
          >
            <span className="font-[500] text-[#181E25] pr-4">{faq.question}</span>
            <svg className={`w-5 h-5 text-[#181E25] flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isExpanded && (
            <div className="px-6 pb-6">
              <p className="text-[15px] text-[#666] leading-[26px]">{faq.answer}</p>
            </div>
          )}
        </div>
      )
    })}
  </div>
</div>
```

---

## 数据模型 (ProductItem)

```typescript
interface ProductItem {
  id: number
  name: string              // 产品名称，如 "TierFlow"
  slug: string              // URL 路径，如 "tierflow"
  tagline: string           // 短标语，如 "智能分层推理引擎"
  shortDescription: string  // 简短描述
  fullDescription: string   // 完整描述
  icon: string              // 图标路径
  image: string             // 主图路径
  category: string          // 分类
  isActive: boolean         // 是否上线
  sortOrder: number         // 排序
  createdAt: string         // 创建日期

  // 核心数据
  stats?: {
    label: string           // 标签，如 "成本降低"
    value: string           // 数值，如 "70"
    suffix: string          // 后缀，如 "%"
  }[]

  // 核心能力
  highlights?: {
    id: string
    title: string
    description: string
    icon: string            // 图标名称
  }[]

  // 使用场景
  useCases?: {
    id: string
    title: string
    description: string
    benefits: string[]       // 优势列表
    image?: string
  }[]

  // 价格方案
  pricing?: {
    description: string
    contactSales: boolean
    plans: {
      id: string
      name: string
      price: string
      period?: string
      description: string
      features: string[]
      isRecommended: boolean
    }[]
  }

  // 常见问题
  faqs?: {
    id: string
    question: string
    answer: string
  }[]

  // Markdown 内容
  content: string
}
```

---

## 代码块样式

代码块使用深色主题，与 MiniMax 官网风格一致：

```tsx
// MarkdownRenderer.tsx 中的配置
pre: ({ children }) => (
  <div className="bg-[#181E25] rounded-[12px] my-6 overflow-hidden">
    {language && (
      <div className="flex items-center justify-between px-4 py-2 bg-[#2a2f38] border-b border-[#3a3f48]">
        <span className="text-[12px] text-[#999] font-mono uppercase">{language}</span>
        <button className="text-[12px] text-[#999] hover:text-white transition-colors">
          复制
        </button>
      </div>
    )}
    <pre className="p-4 overflow-x-auto text-[14px] font-mono leading-[24px]">
      {children}
    </pre>
  </div>
)

code: ({ children, className }) => {
  const isInline = !className
  if (isInline) {
    return <code className="bg-[#F7F8FA] text-[#181E25] px-2 py-1 rounded text-[14px] font-mono">{children}</code>
  }
  return <code className={className}>{children}</code>
}
```

---

## 响应式断点

| 断点 | 宽度 | 内容区域 |
|------|------|----------|
| mobile | < 640px | 100% padding 20px |
| tablet | 640px - 1024px | 1000px |
| desktop | > 1024px | 1000px |

---

## 组件文件位置

- 产品详情页客户端组件: `src/app/(static)/products/[slug]/ProductDetailClient.tsx`
- Markdown 渲染器: `src/components/MarkdownRenderer.tsx`
- 产品数据文件: `content/products/*.md`

---

## 快速开始步骤

1. 在 `content/products/` 目录下创建新的 Markdown 文件
2. 按照数据模型填充字段内容
3. 确保图片路径正确放置在 `public/images/` 目录
4. 页面会自动生成，无需额外代码
