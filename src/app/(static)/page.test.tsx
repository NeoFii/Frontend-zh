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

describe('Home', () => {
  it('lets the site layout own the semantic main landmark', () => {
    const { container } = render(React.createElement(Home))

    expect(container.querySelector('main')).not.toBeInTheDocument()
    expect(container.firstElementChild).toHaveClass('relative')
    expect(container.firstElementChild).toHaveClass('overflow-x-hidden')
  })

  it('renders the final CTA as a labelled section instead of a footer', () => {
    const { container } = render(React.createElement(Home))

    expect(container.querySelector('footer')).not.toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: '准备好升级您的 AI 架构了吗？' })
    ).toBeInTheDocument()
  })
})
