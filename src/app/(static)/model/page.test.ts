import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import useSWR from 'swr'
import ModelPage from './page'

jest.mock('swr', () => jest.fn())

jest.mock('@/components/model/CategoryTabs', () => {
  return function CategoryTabs() {
    return React.createElement('div', null, 'Category Tabs')
  }
})

jest.mock('@/components/model/ModelSearch', () => {
  return function ModelSearch() {
    return React.createElement('div', null, 'Model Search')
  }
})

jest.mock('@/components/model/VendorFilter', () => {
  return function VendorFilter() {
    return React.createElement('div', null, 'Vendor Filter')
  }
})

jest.mock('@/components/model/ModelCardV2', () => {
  return function ModelCardV2({ model }: { model: { name: string; summary?: string } }) {
    return React.createElement('div', null, `${model.name}:${model.summary ?? ''}`)
  }
})

const mockedUseSWR = useSWR as jest.Mock

describe('ModelPage', () => {
  beforeEach(() => {
    mockedUseSWR.mockImplementation((key: unknown) => {
      if (key === 'categories') {
        return { data: [{ id: 1, key: 'reasoning', name: 'Reasoning', sort_order: 1, is_active: true }] }
      }
      if (key === 'vendors') {
        return {
          data: [
            { id: 1, slug: 'openai', name: 'OpenAI', is_active: true },
            { id: 2, slug: 'anthropic', name: 'Anthropic', is_active: true },
          ],
        }
      }
      if (Array.isArray(key) && key[0] === 'models') {
        return {
          data: {
            items: [
              {
                id: 1,
                slug: 'gpt-5',
                name: 'gpt-5',
                summary: '广泛通用能力，工具调用稳定。',
                description: '这里是详情正文，不应作为卡片摘要。',
                capability_tags: ['chat'],
                context_window: 200000,
                max_output_tokens: 32000,
                is_reasoning_model: false,
                sort_order: 1,
                vendor: { id: 1, slug: 'openai', name: 'OpenAI' },
                categories: [],
              },
            ],
            total: 30,
            page: 1,
            page_size: 100,
          },
          isLoading: false,
        }
      }
      return { data: undefined, isLoading: false }
    })
  })

  it('renders the product-style hero copy and model stats badge', () => {
    const { container } = render(React.createElement(ModelPage))
    const pageContainer = container.querySelector('main > div + div')
    const grid = container.querySelector('.grid.grid-cols-1.gap-4')

    expect(screen.getByText('30 个模型 · 2 家厂商')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'TierFlow 支持的模型' })).toBeInTheDocument()
    expect(screen.getByText('gpt-5:广泛通用能力，工具调用稳定。')).toBeInTheDocument()
    expect(screen.queryByText(/这里是详情正文/)).not.toBeInTheDocument()
    expect(
      screen.getByText(/调度器会在这些模型中选择最合适的一个。你也可以在代码里显式指定/)
    ).toBeInTheDocument()
    expect(screen.queryByText('探索 AI 模型矩阵')).not.toBeInTheDocument()
    expect(container.querySelector('main > div + div > div')).not.toHaveClass('rounded-[1.75rem]')
    expect(pageContainer).toHaveClass('max-w-[1200px]')
    expect(pageContainer).toHaveClass('lg:px-0')
    expect(grid).toHaveClass('lg:grid-cols-3')
  })
})
