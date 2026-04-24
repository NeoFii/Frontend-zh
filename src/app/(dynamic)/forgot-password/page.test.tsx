import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'
import ForgotPassword from './page'

const push = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

jest.mock('@/lib/api/auth', () => ({
  sendResetPasswordCode: jest.fn(),
  resetPassword: jest.fn(),
}))

describe('ForgotPassword page', () => {
  it('uses the login-aligned left aside design', () => {
    const { container } = render(React.createElement(ForgotPassword))

    expect(screen.queryByText('当你调用 AI，')).not.toBeInTheDocument()
    expect(screen.queryByText('就是在调用我们。')).not.toBeInTheDocument()

    const aside = container.querySelector('aside')
    expect(aside).not.toBeNull()
    expect(aside).toHaveClass('lg:justify-center')

    const heading = within(aside as HTMLElement).getByRole('heading', {
      name: /让智能体用\s*对的\s*模型\s*而不是贵的/,
    })
    expect(heading.querySelector('br')).not.toBeNull()
    expect(heading).toHaveTextContent('让智能体用对的模型而不是贵的')

    expect(screen.getByRole('heading', { name: '忘记密码' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '立即登录' })).toHaveAttribute('href', '/login')
  })
})
