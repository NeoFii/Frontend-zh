import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import useSWR from 'swr'
import ModelDetailClient from './ModelDetailClient'

jest.mock('swr', () => jest.fn())

jest.mock('next/link', () => {
  function MockLink({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    return React.createElement('a', { href, className }, children)
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

jest.mock('next/image', () => {
  function MockImage({ alt }: { alt: string }) {
    return React.createElement('img', { alt })
  }
  MockImage.displayName = 'MockImage'
  return MockImage
})

jest.mock('@/components/MarkdownRenderer', () => {
  return function MarkdownRenderer({ content }: { content: string }) {
    return React.createElement('div', null, content)
  }
})

const mockedUseSWR = useSWR as jest.Mock

describe('ModelDetailClient', () => {
  beforeEach(() => {
    mockedUseSWR.mockReturnValue({
      data: {
        id: 1,
        slug: 'deepseek-r1',
        name: 'DeepSeek-R1',
        summary: '适合数学、代码与复杂规划任务。',
        description: '开源推理模型，擅长数学、代码与复杂分析。',
        price_input_per_m_fen: 1234,
        price_output_per_m_fen: 5678,
        capability_tags: ['chat', 'reasoning', 'coding'],
        context_window: 128000,
        max_output_tokens: 32000,
        is_reasoning_model: true,
        sort_order: 1,
        is_active: true,
        vendor: {
          id: 1,
          slug: 'deepseek',
          name: 'DeepSeek',
          logo_url: '/deepseek.png',
        },
        categories: [
          {
            key: 'reasoning',
            name: '逻辑推理与规划',
            sort_order: 1,
          },
        ],
        offerings: [
          {
            id: 1,
            provider: {
              id: 1,
              slug: 'openrouter',
              name: 'OpenRouter',
              logo_url: '/openrouter.png',
            },
            is_active: true,
            metrics: {
              sample_count: 3,
              avg_ttft_ms: 800,
              avg_e2e_latency_ms: 2400,
              avg_throughput_tps: 32.4,
            },
          },
        ],
      },
      isLoading: false,
    })
  })

  it('renders summary separately from description and formats fen prices with two decimals', () => {
    const { container } = render(React.createElement(ModelDetailClient, { modelId: 'deepseek-r1' }))

    expect(screen.getByRole('link', { name: /返回模型列表/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'DeepSeek / DeepSeek-R1' })).toBeInTheDocument()
    expect(screen.getByText('适合数学、代码与复杂规划任务。')).toBeInTheDocument()
    expect(screen.getByText('上下文窗口')).toBeInTheDocument()
    expect(screen.getByText('每百万输入价格')).toBeInTheDocument()
    expect(screen.getByText('每百万输出价格')).toBeInTheDocument()
    expect(screen.getByText('¥12.34')).toBeInTheDocument()
    expect(screen.getByText('¥56.78')).toBeInTheDocument()
    expect(screen.queryByText('¥1234')).not.toBeInTheDocument()
    expect(screen.queryByText('¥5678')).not.toBeInTheDocument()
    expect(screen.queryByText('最大输出')).not.toBeInTheDocument()
    expect(screen.queryByText('支持服务商与性能')).not.toBeInTheDocument()
    expect(screen.queryByText('暂无可用提供商数据')).not.toBeInTheDocument()
    expect(screen.queryByText('OpenRouter')).not.toBeInTheDocument()
    expect(screen.queryByText('近期性能（均值）')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '模型介绍' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '能力标签' })).not.toBeInTheDocument()
    expect(screen.queryByText('chat')).not.toBeInTheDocument()
    expect(screen.queryByText('reasoning')).not.toBeInTheDocument()
    expect(screen.queryByText('coding')).not.toBeInTheDocument()

    const metricsSection = screen.getByText('上下文窗口').closest('section')
    const introSection = screen.getByRole('heading', { name: '模型介绍' }).closest('section')

    expect(metricsSection).toBeTruthy()
    expect(introSection).toBeTruthy()
    expect(
      metricsSection!.compareDocumentPosition(introSection!) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()

    expect(container.textContent).toContain('开源推理模型，擅长数学、代码与复杂分析。')
  })

  it('shows a placeholder when model-level fen pricing is absent', () => {
    mockedUseSWR.mockReturnValue({
      data: {
        id: 1,
        slug: 'deepseek-r1',
        name: 'DeepSeek-R1',
        summary: '价格待补充的模型。',
        description: '正文仍然单独展示。',
        capability_tags: ['reasoning'],
        context_window: 128000,
        max_output_tokens: 32000,
        is_reasoning_model: true,
        sort_order: 1,
        is_active: true,
        vendor: {
          id: 1,
          slug: 'deepseek',
          name: 'DeepSeek',
          logo_url: '/deepseek.png',
        },
        categories: [],
        offerings: [],
      },
      isLoading: false,
    })

    render(React.createElement(ModelDetailClient, { modelId: 'deepseek-r1' }))

    expect(screen.getAllByText('待配置')).toHaveLength(2)
  })
})
