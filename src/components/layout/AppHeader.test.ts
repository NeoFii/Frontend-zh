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
  it('renders the SVG brand mark with gradient fill', () => {
    const { container } = render(React.createElement(AppHeader))

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    const gradient = container.querySelector('linearGradient')
    expect(gradient).toBeInTheDocument()
  })

  it('renders the shared brand label in the header logo', () => {
    render(React.createElement(AppHeader))

    expect(screen.getByText('TierFlow')).toHaveClass('font-semibold', 'group-hover:text-primary-600')
    expect(screen.getByText('TierFlow')).not.toHaveClass('font-bold')
  })

  it('keeps the login button steady on hover', () => {
    render(React.createElement(AppHeader))

    const [loginButton] = screen.getAllByRole('button', { name: '登录' })

    expect(loginButton).not.toHaveClass('hover:scale-105')
    expect(loginButton).not.toHaveClass('hover:shadow-lg')
  })
})
