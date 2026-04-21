import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AppHeader from './AppHeader'

const push = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push }),
}))

describe('AppHeader', () => {
  it('keeps the login button steady on hover', () => {
    render(React.createElement(AppHeader))

    const [loginButton] = screen.getAllByRole('button', { name: '登录' })

    expect(loginButton).not.toHaveClass('hover:scale-105')
    expect(loginButton).not.toHaveClass('hover:shadow-lg')
    expect(loginButton).not.toHaveClass('hover:shadow-gray-900/20')
  })
})
