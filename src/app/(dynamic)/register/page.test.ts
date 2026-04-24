import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'
import Register from './page'

const push = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('Register page', () => {
  it('uses the simplified login-aligned auth shell', () => {
    const { container } = render(React.createElement(Register))

    expect(screen.queryByRole('link', { name: /TierFlow/ })).not.toBeInTheDocument()
    expect(screen.queryByText('已有账户？')).not.toBeInTheDocument()
    expect(screen.queryByText('Secure signup')).not.toBeInTheDocument()
    expect(screen.queryByText('© 2026 Eucal AI')).not.toBeInTheDocument()
    expect(screen.queryByText('$ tierflow auth register')).not.toBeInTheDocument()
    expect(screen.queryByText('¥20.00')).not.toBeInTheDocument()

    const aside = container.querySelector('aside')
    expect(aside).not.toBeNull()
    expect(aside).toHaveClass('lg:justify-center')

    const heading = within(aside as HTMLElement).getByRole('heading', {
      name: /让智能体用\s*对的\s*模型\s*而不是贵的/,
    })
    expect(heading.querySelector('br')).not.toBeNull()
    expect(heading).toHaveTextContent('让智能体用对的模型而不是贵的')

    expect(screen.getByText('已有账号？')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '立即登录' })).toHaveAttribute('href', '/login')
  })
})
