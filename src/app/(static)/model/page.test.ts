import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import useSWR from 'swr'
import ModelPage from './page'
import { getModels } from '@/lib/api/model-catalog'

jest.mock('swr', () => jest.fn())

jest.mock('@/lib/api/model-catalog', () => ({
  getCategories: jest.fn(),
  getVendors: jest.fn(),
  getModels: jest.fn(),
}))

jest.mock('@/components/model/CategoryTabs', () => {
  return function CategoryTabs({
    onChange,
  }: {
    onChange: (key: string | null) => void
  }) {
    return React.createElement(
      'div',
      null,
      React.createElement('button', { onClick: () => onChange('reasoning') }, 'Reasoning'),
      React.createElement('button', { onClick: () => onChange(null) }, 'All Models')
    )
  }
})

jest.mock('@/components/model/ModelSearch', () => {
  return function ModelSearch() {
    return React.createElement('div', null, 'Model Search')
  }
})

jest.mock('@/components/model/VendorFilter', () => {
  return function VendorFilter({
    onChange,
  }: {
    onChange: (vendors: string[]) => void
  }) {
    return React.createElement(
      'div',
      null,
      React.createElement('button', { onClick: () => onChange(['openai']) }, 'OpenAI')
    )
  }
})

jest.mock('@/components/model/ModelCard', () => {
  return function ModelCard({ model }: { model: { name: string; summary?: string } }) {
    return React.createElement('div', null, `${model.name}:${model.summary ?? ''}`)
  }
})

const mockedUseSWR = useSWR as jest.Mock
const mockedGetModels = getModels as jest.Mock

const firstPageData = {
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
  page_size: 24,
}

const secondPageData = {
  ...firstPageData,
  page: 2,
  items: [
    {
      ...firstPageData.items[0],
      id: 2,
      slug: 'claude-sonnet-4-5',
      name: 'claude-sonnet-4.5',
      vendor: { id: 2, slug: 'anthropic', name: 'Anthropic' },
    },
  ],
}

describe('ModelPage', () => {
  beforeEach(() => {
    mockedGetModels.mockResolvedValue(firstPageData)
    mockedUseSWR.mockImplementation((key: unknown, fetcher?: () => unknown) => {
      if (key === 'categories') {
        fetcher?.()
        return { data: [{ id: 1, key: 'reasoning', name: 'Reasoning', sort_order: 1, is_active: true }] }
      }
      if (key === 'vendors') {
        fetcher?.()
        return {
          data: [
            { id: 1, slug: 'openai', name: 'OpenAI', is_active: true },
            { id: 2, slug: 'anthropic', name: 'Anthropic', is_active: true },
          ],
        }
      }
      if (Array.isArray(key) && key[0] === 'models') {
        fetcher?.()
        return {
          data: key[3] === 2 ? secondPageData : firstPageData,
          isLoading: false,
        }
      }
      return { data: undefined, isLoading: false }
    })
  })

  it('renders the product-style hero copy without model stats badge', () => {
    const { container } = render(React.createElement(ModelPage))
    const pageContainer = container.querySelector('main > div + div')
    const grid = container.querySelector('.grid.grid-cols-1.gap-4')

    expect(screen.queryByText('30 个模型 · 2 家厂商')).not.toBeInTheDocument()
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

  it('does not render model search or send q when requesting models', () => {
    render(React.createElement(ModelPage))

    expect(screen.queryByText('Model Search')).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(mockedGetModels).toHaveBeenCalledWith({
      category: undefined,
      vendors: undefined,
      page: 1,
      page_size: 24,
    })
  })

  it('shows pagination status and moves between pages', async () => {
    render(React.createElement(ModelPage))

    expect(screen.getByText('共 30 个模型 · 第 1 / 2 页')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '上一页' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '下一页' })).not.toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: '下一页' }))

    expect(mockedGetModels).toHaveBeenLastCalledWith({
      category: undefined,
      vendors: undefined,
      page: 2,
      page_size: 24,
    })
    expect(screen.getByText('共 30 个模型 · 第 2 / 2 页')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '上一页' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: '下一页' })).toBeDisabled()
  })

  it('resets to the first page when category or vendor filters change', async () => {
    render(React.createElement(ModelPage))

    fireEvent.click(screen.getByRole('button', { name: '下一页' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reasoning' }))

    expect(mockedGetModels).toHaveBeenLastCalledWith({
      category: 'reasoning',
      vendors: undefined,
      page: 1,
      page_size: 24,
    })

    fireEvent.click(screen.getByRole('button', { name: '下一页' }))
    fireEvent.click(screen.getByRole('button', { name: 'OpenAI' }))

    expect(mockedGetModels).toHaveBeenLastCalledWith({
      category: 'reasoning',
      vendors: ['openai'],
      page: 1,
      page_size: 24,
    })
  })
})
