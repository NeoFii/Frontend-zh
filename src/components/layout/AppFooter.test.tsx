import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AppFooter from './AppFooter'

describe('AppFooter', () => {
  it('renders the SVG brand mark with gradient fill for light background', () => {
    const { container } = render(<AppFooter />)

    const gradient = container.querySelector('linearGradient')
    expect(gradient).toBeInTheDocument()
    expect(gradient?.querySelector('stop')?.getAttribute('stop-color')).toBe('#4A3AF8')

    expect(screen.getByText('TierFlow')).toHaveClass('font-semibold')
    expect(screen.getByText('TierFlow')).not.toHaveClass('font-bold')
  })

  it('uses a light background instead of dark', () => {
    const { container } = render(<AppFooter />)
    const footer = container.querySelector('footer')
    expect(footer?.className).toContain('bg-[#f5f6fb]')
  })
})
