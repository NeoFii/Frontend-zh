'use client'

import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import remarkGfm from 'remark-gfm'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// 自定义 schema：在默认白名单基础上允许代码高亮所需的 class
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: ['className'],
    span: ['className', 'style'],
    pre: ['className'],
    div: ['className'],
  },
}

/**
 * Markdown 渲染组件
 * 统一处理 Markdown 内容的渲染样式
 * 已启用 rehype-sanitize 防止 XSS 攻击
 */
export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <article className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // rehype-sanitize 必须在其他 rehype 插件之前，否则高亮注入的 class 会被清除
        rehypePlugins={[
          [rehypeSanitize, sanitizeSchema],
        ]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const codeContent = String(children).replace(/\n$/, '')
            // 有换行符或有 language-xxx className = 代码块；否则 = 行内代码
            const isInline = !match && !codeContent.includes('\n')

            if (isInline) {
              return (
                <code className="bg-[#F7F8FA] text-[#181E25] px-2 py-1 rounded text-[14px] font-mono" {...props}>
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
                  {codeContent}
                </SyntaxHighlighter>
              </div>
            ) : (
              // 无语言标识的代码块，用简单样式渲染
              <div className="rounded-[12px] my-6 overflow-hidden bg-[#282c34]">
                <pre className="p-4 text-[14px] text-white overflow-x-auto">
                  <code>{codeContent}</code>
                </pre>
              </div>
            )
          },
          pre: ({ children }) => <>{children}</>,
          h1: ({ children }) => <h1 className="text-[40px] font-[500] text-[#181E25] leading-[1.6] mt-[52px] mb-[24px]">{children}</h1>,
          h2: ({ children }) => <h2 className="text-[32px] font-[500] text-[#181E25] leading-[1.5] mt-[44px] mb-[20px]">{children}</h2>,
          h3: ({ children }) => <h3 className="text-[26px] font-[500] text-[#181E25] leading-[1.5] mt-[36px] mb-[16px]">{children}</h3>,
          h4: ({ children }) => <h4 className="text-[22px] font-[500] text-[#181E25] leading-[1.5] mt-[28px] mb-[12px]">{children}</h4>,
          h5: ({ children }) => <h5 className="text-lg font-[500] text-[#181E25] leading-[1.5] mt-6 mb-2">{children}</h5>,
          h6: ({ children }) => <h6 className="text-base font-[500] text-[#181E25] leading-[1.5] mt-5 mb-2">{children}</h6>,
          p: ({ children }) => <p className="text-[#181E25] text-[18px] font-[300] leading-[32px] mb-[24px]">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-[24px] text-[#181E25] text-[18px] font-[300] leading-[32px] space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-[24px] text-[#181E25] text-[18px] font-[300] leading-[32px] space-y-2">{children}</ol>,
          li: ({ children }) => <li className="text-[#181E25] text-[18px] font-[300] leading-[32px]">{children}</li>,
          strong: ({ children }) => <strong className="font-[500] text-[#181E25]">{children}</strong>,
          b: ({ children }) => <b className="font-[500] text-[#181E25]">{children}</b>,
          em: ({ children }) => <em className="italic">{children}</em>,
          i: ({ children }) => <i className="italic">{children}</i>,
          a: ({ href, children }) => {
            // 安全验证：检查是否为外部链接
            // rehype-sanitize 已过滤危险协议，这里只需处理外链行为
            const isExternal = href?.startsWith('http')
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="text-primary-600 hover:text-primary-700 no-underline hover:underline"
              >
                {children}
              </a>
            )
          },
          blockquote: ({ children }) => <blockquote className="border-l-2 border-[#181E25] pl-4 my-6 italic text-[#666666] text-[18px] leading-[32px]">{children}</blockquote>,
          hr: () => <hr className="my-8 border-gray-200" />,
          center: ({ children }) => <div className="text-center">{children}</div>,
          img: ({ src, alt }) => {
            // 安全验证：禁止危险协议 URL
            // rehype-sanitize 已过滤大部分危险协议，这里作为额外保护
            const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'blob:']
            if (!src || dangerousProtocols.some(p => src.startsWith(p))) {
              return null
            }
            return (
              <span className="block relative w-full aspect-video my-6">
                <Image
                  src={src}
                  alt={alt || ''}
                  fill
                  className="object-contain rounded-[12px]"
                />
              </span>
            )
          },
          table: ({ children }) => <table className="w-full border-collapse my-6">{children}</table>,
          thead: ({ children }) => <thead className="bg-[#F7F8FA]">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
          th: ({ children }) => <th className="text-left py-3 px-4 font-[500] text-[#181E25]">{children}</th>,
          td: ({ children }) => <td className="py-3 px-4 text-[#666666]">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
