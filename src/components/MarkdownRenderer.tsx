'use client'

import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

interface MarkdownRendererProps {
  content: string
  className?: string
}

/**
 * Markdown 渲染组件
 * 统一处理 Markdown 内容的渲染样式
 */
export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <article className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          h1: ({ children }) => <h1 className="text-[40px] font-semibold text-gray-900 leading-[56px] mt-[52px] mb-6">{children}</h1>,
          h2: ({ children }) => <h2 className="text-[32px] font-semibold text-gray-900 leading-[48px] mt-[44px] mb-5">{children}</h2>,
          h3: ({ children }) => <h3 className="text-[26px] font-semibold text-gray-900 leading-[40px] mt-9 mb-4">{children}</h3>,
          h4: ({ children }) => <h4 className="text-[22px] font-semibold text-gray-900 leading-[32px] mt-7 mb-3">{children}</h4>,
          h5: ({ children }) => <h5 className="text-lg font-semibold text-gray-900 leading-7 mt-6 mb-2">{children}</h5>,
          h6: ({ children }) => <h6 className="text-base font-semibold text-gray-900 leading-6 mt-5 mb-2">{children}</h6>,
          p: ({ children }) => <p className="text-gray-800 text-base font-light leading-[28.8px] mb-5">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-5 text-gray-800 text-base font-light leading-[28.8px] space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 text-gray-800 text-base font-light leading-[28.8px] space-y-2">{children}</ol>,
          li: ({ children }) => <li className="text-gray-800 text-base font-light leading-[28.8px]">{children}</li>,
          strong: ({ children }) => <strong className="font-medium text-gray-900">{children}</strong>,
          b: ({ children }) => <b className="font-medium text-gray-900">{children}</b>,
          em: ({ children }) => <em className="italic">{children}</em>,
          i: ({ children }) => <i className="italic">{children}</i>,
          a: ({ href, children }) => <a href={href} className="text-primary-600 hover:text-primary-700 no-underline hover:underline">{children}</a>,
          code: ({ children }) => <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
          pre: ({ children }) => <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto my-6 text-sm font-mono">{children}</pre>,
          blockquote: ({ children }) => <blockquote className="border-l-2 border-gray-300 pl-4 my-6 italic text-gray-600">{children}</blockquote>,
          hr: () => <hr className="my-8 border-gray-200" />,
          center: ({ children }) => <div className="text-center">{children}</div>,
          img: ({ src, alt }) => (
            <span className="block relative w-full aspect-video my-6">
              <Image
                src={src || ''}
                alt={alt || ''}
                fill
                className="object-contain rounded-lg"
              />
            </span>
          ),
          table: ({ children }) => <table className="w-full border-collapse my-6">{children}</table>,
          thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
          th: ({ children }) => <th className="text-left py-3 px-4 font-semibold text-gray-900">{children}</th>,
          td: ({ children }) => <td className="py-3 px-4 text-gray-700">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
