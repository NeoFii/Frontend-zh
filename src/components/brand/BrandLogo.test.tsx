import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { BrandLogo, BrandMark } from './BrandLogo'

describe('BrandLogo', () => {
  it('renders the SVG mark and TierFlow label', () => {
    const { container } = render(<BrandLogo />)

    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.getByText('TierFlow')).toHaveClass('font-semibold')
  })

  it('renders a custom label', () => {
    render(<BrandLogo label="TierFlow" />)

    expect(screen.getByText('TierFlow')).toBeInTheDocument()
  })

  it('renders mark at each size without crashing', () => {
    const { container } = render(
      <>
        <BrandMark size="sm" data-testid="mark-sm" />
        <BrandMark size="md" data-testid="mark-md" />
        <BrandMark size="lg" data-testid="mark-lg" />
        <BrandMark size="hero" data-testid="mark-hero" />
      </>
    )

    expect(container.querySelectorAll('svg').length).toBe(4)
    expect(screen.getByTestId('mark-sm')).toHaveClass('h-7', 'w-7')
    expect(screen.getByTestId('mark-lg')).toHaveClass('h-9', 'w-9')
    expect(screen.getByTestId('mark-hero')).toHaveClass('h-14', 'w-14')
  })

  it('uses gradient fill for default tone and white for inverse', () => {
    const { container: defaultContainer } = render(<BrandMark data-testid="default" />)
    const { container: inverseContainer } = render(<BrandMark tone="inverse" data-testid="inverse" />)

    const defaultGrad = defaultContainer.querySelector('linearGradient')
    expect(defaultGrad).toBeInTheDocument()
    expect(defaultGrad?.querySelector('stop')?.getAttribute('stop-color')).toBe('#4A3AF8')

    const inverseGrad = inverseContainer.querySelector('linearGradient')
    expect(inverseGrad).toBeInTheDocument()
    expect(inverseGrad?.querySelector('stop')?.getAttribute('stop-color')).toBe('#ffffff')
  })
})
