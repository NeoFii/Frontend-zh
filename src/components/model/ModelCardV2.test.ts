import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ModelCardV2 from './ModelCardV2'

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

describe('ModelCardV2', () => {
  it('renders model card with vendor, name, tags, and context window', () => {
    render(
      React.createElement(ModelCardV2, {
        model: {
          id: 1,
          slug: 'gpt-5',
          name: 'gpt-5',
          capability_tags: ['chat', 'tool_calling'],
          context_window: 200000,
          max_output_tokens: 32000,
          summary: '广泛通用能力，工具调用稳定。',
          price_input_per_m_fen: 1234,
          price_output_per_m_fen: 5678,
          is_reasoning_model: true,
          sort_order: 1,
          vendor: {
            id: 1,
            slug: 'openai',
            name: 'OpenAI',
            logo_url: '/openai.png',
          },
          categories: [
            {
              key: 'reasoning',
              name: 'Reasoning',
              sort_order: 1,
            },
          ],
        },
      })
    )

    expect(screen.getByText('OpenAI/gpt-5')).toBeInTheDocument()
    expect(screen.getByText('Reasoning')).toBeInTheDocument()
    expect(screen.getByText('chat')).toBeInTheDocument()
    expect(screen.getByText('tool_calling')).toBeInTheDocument()
    expect(screen.getByText('推理')).toBeInTheDocument()
    expect(screen.getByText('CTX')).toBeInTheDocument()
    expect(screen.getByText('IN / 1M')).toBeInTheDocument()
    expect(screen.getByText('OUT / 1M')).toBeInTheDocument()
    expect(screen.getByText('200K')).toBeInTheDocument()
    expect(screen.getByText('¥12.34')).toBeInTheDocument()
    expect(screen.getByText('¥56.78')).toBeInTheDocument()
  })

  it('shows placeholders when model-level fen pricing is absent', () => {
    render(
      React.createElement(ModelCardV2, {
        model: {
          id: 1,
          slug: 'gpt-5',
          name: 'gpt-5',
          capability_tags: [],
          context_window: 200000,
          max_output_tokens: 32000,
          is_reasoning_model: false,
          sort_order: 1,
          vendor: {
            id: 1,
            slug: 'openai',
            name: 'OpenAI',
          },
          categories: [],
        },
      })
    )

    expect(screen.getAllByText('待配置')).toHaveLength(2)
  })
})
