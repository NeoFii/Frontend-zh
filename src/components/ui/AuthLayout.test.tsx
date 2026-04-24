import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'
import AuthLayout from './AuthLayout'

describe('AuthLayout', () => {
  it('keeps only the form-side TierFlow logo', () => {
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

    const aside = container.querySelector('aside')
    expect(aside).not.toBeNull()
    expect(within(aside as HTMLElement).queryByText('TierFlow')).not.toBeInTheDocument()
  })
})
