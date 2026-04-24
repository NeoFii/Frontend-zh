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
  it('uses the same slash mark logo as the auth pages', () => {
    render(React.createElement(AppHeader))

    const logoMark = screen.getByText('/')

    expect(logoMark).toHaveClass('grid')
    expect(logoMark).toHaveClass('h-7')
    expect(logoMark).toHaveClass('w-7')
    expect(logoMark).toHaveClass('place-items-center')
    expect(logoMark).toHaveClass('rounded-md')
    expect(logoMark).toHaveClass('bg-[#111827]')
    expect(logoMark).toHaveClass('font-mono')
    expect(logoMark).toHaveClass('font-bold')
    expect(logoMark).toHaveClass('text-white')
    expect(screen.queryByText('E')).not.toBeInTheDocument()
  })

  it('renders the shared brand label in the header logo', () => {
    render(React.createElement(AppHeader))

    expect(screen.getByText('Eucal AI')).toHaveClass('font-semibold', 'group-hover:text-primary-600')
    expect(screen.getByText('Eucal AI')).not.toHaveClass('font-bold')
  })

  it('keeps the login button steady on hover', () => {
    render(React.createElement(AppHeader))

    const [loginButton] = screen.getAllByRole('button', { name: '登录' })

    expect(loginButton).not.toHaveClass('hover:scale-105')
    expect(loginButton).not.toHaveClass('hover:shadow-lg')
    expect(loginButton).not.toHaveClass('hover:shadow-gray-900/20')
  })
})
