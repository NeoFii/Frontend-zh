# 新闻详情页面设计规范

## 概述

本文档定义了 Eucal AI 新闻详情页面的设计规范，基于 MiniMax 官网设计风格。适用于新闻详情页面渲染参考使用。

## 设计风格

- **布局**: 居中对齐，最大宽度 768px
- **配色**:
  - 主文字色: `#181E25` (深色)
  - 背景色: `#FFFFFF` (白色)
  - 辅助文字: `#666666`
- **字体**: 使用系统字体，字重 300/400/500
- **间距**: 使用 Tailwind 间距系统，如 `mb-[24px]`, `py-[48px]`
- **圆角**: 图片圆角 `rounded-lg` 或 `rounded-[12px]`

---

## 页面结构

### 1. 标题区域

```tsx
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
```

### 2. 封面图（可选）

```tsx
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
```

### 3. 正文内容 (Markdown)

```tsx
<div className="w-full px-[20px] lg:px-0 lg:w-[768px] pb-[120px]">
  <MarkdownRenderer content={news.content} />
</div>
```

---

## Markdown 内容样式

新闻正文使用 MarkdownRenderer 组件渲染，样式配置如下：

### 标题样式

```tsx
h1: ({ children }) => (
  <h1 className="text-[40px] font-[500] text-[#181E25] leading-[1.6] mt-[52px] mb-[24px]">
    {children}
  </h1>
),

h2: ({ children }) => (
  <h2 className="text-[32px] font-[500] text-[#181E25] leading-[1.5] mt-[44px] mb-[20px]">
    {children}
  </h2>
),

h3: ({ children }) => (
  <h3 className="text-[26px] font-[500] text-[#181E25] leading-[1.5] mt-[36px] mb-[16px]">
    {children}
  </h3>
),

h4: ({ children }) => (
  <h4 className="text-[22px] font-[500] text-[#181E25] leading-[1.5] mt-[28px] mb-[12px]">
    {children}
  </h4>
),
```

### 段落样式

```tsx
p: ({ children }) => (
  <p className="text-[#181E25] text-[18px] font-[300] leading-[32px] mb-[24px]">
    {children}
  </p>
),
```

### 强调文本

```tsx
strong: ({ children }) => (
  <strong className="font-[500] text-[#181E25]">{children}</strong>
),

em: ({ children }) => (
  <em className="italic">{children}</em>
),
```

### 链接

```tsx
a: ({ href, children }) => (
  <a
    href={href}
    className="text-primary-600 hover:text-primary-700 no-underline hover:underline"
  >
    {children}
  </a>
),
```

### 列表

```tsx
ul: ({ children }) => (
  <ul className="list-disc pl-6 mb-[24px] text-[#181E25] text-[18px] font-[300] leading-[32px] space-y-2">
    {children}
  </ul>
),

ol: ({ children }) => (
  <ol className="list-decimal pl-6 mb-[24px] text-[#181E25] text-[18px] font-[300] leading-[32px] space-y-2">
    {children}
  </ol>
),

li: ({ children }) => (
  <li className="text-[#181E25] text-[18px] font-[300] leading-[32px]">
    {children}
  </li>
),
```

### 引用块

```tsx
blockquote: ({ children }) => (
  <blockquote className="border-l-2 border-[#181E25] pl-4 my-6 italic text-[#666666] text-[18px] leading-[32px]">
    {children}
  </blockquote>
),
```

### 代码块

```tsx
code({ className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || '')
  const isInline = !match && !className

  if (isInline) {
    return (
      <code
        className="bg-[#F7F8FA] text-[#181E25] px-2 py-1 rounded text-[14px] font-mono"
        {...props}
      >
        {children}
      </code>
    )
  }

  return match ? (
    <div className="rounded-[12px] my-6 overflow-hidden">
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          lineHeight: '24px',
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  )
},
```

### 图片

```tsx
img: ({ src, alt }) => (
  <span className="block relative w-full aspect-video my-6">
    <Image
      src={src || ''}
      alt={alt || ''}
      fill
      className="object-contain rounded-[12px]"
    />
  </span>
),
```

### 表格

```tsx
table: ({ children }) => (
  <table className="w-full border-collapse my-6">{children}</table>
),

thead: ({ children }) => (
  <thead className="bg-[#F7F8FA]">{children}</thead>
),

tbody: ({ children }) => <tbody>{children}</tbody>,

tr: ({ children }) => (
  <tr className="border-b border-gray-200">{children}</tr>
),

th: ({ children }) => (
  <th className="text-left py-3 px-4 font-[500] text-[#181E25]">
    {children}
  </th>
),

td: ({ children }) => (
  <td className="py-3 px-4 text-[#666666]">{children}</td>
),
```

### 分割线

```tsx
hr: () => <hr className="my-8 border-gray-200" />,
```

---

## 数据模型 (NewsItem)

```typescript
interface NewsItem {
  slug: string           // URL 路径，如 "forge-大规模原生-agent-rl-系统"
  title: string          // 文章标题
  date: string           // 发布日期，格式 "YYYY-MM-DD"
  category: string       // 分类，如 "技术分享"
  coverImage?: string    // 封面图路径（可选）
  content: string        // Markdown 正文内容
}
```

---

## 响应式断点

| 断点 | 宽度 | 内容区域 |
|------|------|----------|
| mobile | < 640px | 100% padding 20px |
| tablet | 640px - 1024px | 768px |
| desktop | > 1024px | 768px |

---

## 组件文件位置

- 新闻详情页服务端组件: `src/app/(static)/news/[slug]/page.tsx`
- Markdown 渲染器: `src/components/MarkdownRenderer.tsx`
- 新闻数据文件: `content/news/*.md`

---

## 快速开始步骤

1. 在 `content/news/` 目录下创建新的 Markdown 文件
2. 按照数据模型填充 frontmatter（标题、日期、分类、封面图）
3. 编写 Markdown 正文内容
4. 确保图片路径正确放置在 `public/images/` 目录
5. 页面会自动生成，无需额外代码

### 示例 Markdown 文件

```markdown
---
title: "Forge: 大规模原生 Agent RL 系统"
date: "2026-02-24"
category: "技术分享"
coverImage: "/images/news/forge-cover.jpg"
---

## 概述

这是文章的导言段落...

## 核心技术

### 架构设计

详细内容...

## 性能优化

- 优势一
- 优势二
- 优势三
```

---

## 与产品页面设计对比

| 元素 | 产品页面 | 新闻页面 |
|------|----------|----------|
| 最大宽度 | 1000px / 768px | 768px |
| 标题字号 | 54px | 40-48px |
| 段落字号 | 18px | 18px |
| 段落字重 | 300 | 300 |
| 行高 | 32px | 32px |
| 标题字重 | 500 | 500 |
| 底部留白 | 160px | 120px |
| 顶部留白 | 80px | 80px |
