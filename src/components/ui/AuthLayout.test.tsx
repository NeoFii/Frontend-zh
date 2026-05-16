import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'
import AuthLayout from './AuthLayout'

describe('AuthLayout', () => {
  it('shows the default auth chrome', () => {
    const { container } = render(
      <AuthLayout
        heading="Auth heading"
        subtitle="Auth subtitle"
        terminal={<div>terminal</div>}
        switchLabel="已有账户？"
        switchLinkText="登录"
        switchHref="/login"
        footerRight="Secure signup"
      >
        <div>form</div>
      </AuthLayout>
    )

    expect(screen.getAllByText('/')).toHaveLength(1)
    expect(screen.getAllByText('TierFlow')).toHaveLength(1)
    expect(screen.getByRole('link', { name: /TierFlow/ })).toHaveAttribute('href', '/')
    expect(screen.getByText('已有账户？')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '登录' })).toHaveAttribute('href', '/login')
    expect(screen.getByText('© 2026 TierFlow')).toBeInTheDocument()
    expect(screen.getByText('Secure signup')).toBeInTheDocument()

    const aside = container.querySelector('aside')
    expect(aside).not.toBeNull()
    expect(within(aside as HTMLElement).queryByText('TierFlow')).not.toBeInTheDocument()
    expect(within(aside as HTMLElement).getByText('Auth subtitle')).toBeInTheDocument()
    expect(within(aside as HTMLElement).getByText('terminal')).toBeInTheDocument()
  })

  it('can render a centered aside without optional chrome', () => {
    const { container } = render(
      React.createElement(
        AuthLayout,
        {
          heading: 'Auth heading',
          switchLabel: '已有账户？',
          switchLinkText: '登录',
          switchHref: '/login',
          footerRight: 'Secure signup',
          showFormHeader: false,
          showFooter: false,
          centerAsideContent: true,
        } as React.ComponentProps<typeof AuthLayout>,
        <div>form</div>,
      ),
    )

    expect(screen.queryByText('/')).not.toBeInTheDocument()
    expect(screen.queryByText('TierFlow')).not.toBeInTheDocument()
    expect(screen.queryByText('已有账户？')).not.toBeInTheDocument()
    expect(screen.queryByText('© 2026 TierFlow')).not.toBeInTheDocument()
    expect(screen.queryByText('Secure signup')).not.toBeInTheDocument()
    expect(screen.queryByText('Auth subtitle')).not.toBeInTheDocument()
    expect(screen.queryByText('terminal')).not.toBeInTheDocument()

    const aside = container.querySelector('aside')
    expect(aside).not.toBeNull()
    expect(aside).toHaveClass('lg:justify-center')
  })
})
