import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'
import Login from './page'

const replace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('@/stores/auth', () => ({
  useAuthStore: (selector?: (state: {
    isHydrated: boolean
    sessionStatus: string
    login: jest.Mock
  }) => unknown) => {
    const state = {
      isHydrated: true,
      sessionStatus: 'anonymous',
      login: jest.fn(),
    }

    return selector ? selector(state) : state
  },
}))

describe('Login page', () => {
  it('uses the simplified login auth shell', () => {
    const { container } = render(React.createElement(Login))

    expect(screen.queryByText('TierFlow')).not.toBeInTheDocument()
    expect(screen.queryByText('还没有账户？')).not.toBeInTheDocument()
    expect(screen.queryByText('Secure auth')).not.toBeInTheDocument()
    expect(screen.queryByText('© 2026 TierFlow')).not.toBeInTheDocument()
    expect(screen.queryByText('$ tierflow auth login')).not.toBeInTheDocument()
    expect(screen.queryByText('¥20.00')).not.toBeInTheDocument()

    const aside = container.querySelector('aside')
    expect(aside).not.toBeNull()

    const heading = within(aside as HTMLElement).getByRole('heading', {
      name: /让智能体用\s*对的\s*模型\s*而不是贵的/,
    })
    expect(heading.querySelector('br')).not.toBeNull()
    expect(heading).toHaveTextContent('让智能体用对的模型而不是贵的')

    expect(screen.getByText('还没有账号？')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '立即注册' })).toHaveAttribute('href', '/register')
  })
})
