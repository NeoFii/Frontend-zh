import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from './page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('next/image', () => {
  return function MockImage({
    alt,
    unoptimized,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { unoptimized?: boolean }) {
    void unoptimized
    return React.createElement('img', { alt, ...props })
  }
})

jest.mock('@/hooks/useUser', () => ({
  useUser: jest.fn(),
}))

jest.mock('@/stores/auth', () => ({
  useAuthStore: (selector: (state: { sessionStatus: string }) => unknown) =>
    selector({ sessionStatus: 'unauthenticated' }),
}))

jest.mock('@/components/Reveal', () => {
  return function MockReveal({ children }: { children: React.ReactNode }) {
    return React.createElement(React.Fragment, null, children)
  }
})

describe('Home (SaaS landing)', () => {
  it('does not render its own main or footer (SiteLayout provides them)', () => {
    const { container } = render(React.createElement(Home))

    expect(container.querySelector('main')).not.toBeInTheDocument()
    expect(container.querySelector('footer')).not.toBeInTheDocument()
  })

  it('renders hero section with brand word and CTA', () => {
    render(React.createElement(Home))

    expect(screen.getAllByText('TierFlow').length).toBeGreaterThan(0)
    expect(screen.getByText('智能体时代的 Token 优化引擎')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /获取 API/i })).toBeInTheDocument()
    expect(screen.getAllByText('查看文档').length).toBeGreaterThan(0)
  })

  it('renders BrainNet-8B tech section', () => {
    render(React.createElement(Home))

    expect(screen.getByText('核心技术 / Core Technology')).toBeInTheDocument()
    expect(screen.getByText('类脑任务感知模型')).toBeInTheDocument()
    expect(screen.getAllByText('BrainNet-8B').length).toBeGreaterThan(0)
    expect(screen.getAllByText('8B').length).toBeGreaterThan(0)
  })

  it('renders proof section with benchmark data', () => {
    render(React.createElement(Home))

    expect(screen.getByText(/PinchBench 基准测试/)).toBeInTheDocument()
    expect(screen.getAllByText('TierFlow').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('88.7%').length).toBeGreaterThan(0)
    expect(screen.getAllByText('2.04').length).toBeGreaterThan(0)
  })

  it('renders provider tags in hero visual', () => {
    render(React.createElement(Home))

    expect(screen.getByText('GPT')).toBeInTheDocument()
    expect(screen.getByText('Claude')).toBeInTheDocument()
    expect(screen.getByText('DeepSeek')).toBeInTheDocument()
  })
})
