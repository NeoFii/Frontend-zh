import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Register from './page'

const push = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('Register page', () => {
  it('uses the same auth shell language as the login page', () => {
    render(React.createElement(Register))

    expect(screen.getAllByText('TierFlow').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: '开通 TierFlow 账户' })).toBeInTheDocument()
    expect(screen.getByText('已有账户？')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '登录' })).toHaveAttribute('href', '/login')
    expect(screen.getByText('Secure signup')).toBeInTheDocument()
  })
})
