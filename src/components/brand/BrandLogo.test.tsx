import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { BrandLogo, BrandMark } from './BrandLogo'

describe('BrandLogo', () => {
  it('renders the default slash mark and Eucal AI label', () => {
    render(<BrandLogo />)

    expect(screen.getByText('/')).toHaveClass('bg-[#111827]', 'text-white')
    expect(screen.getByText('Eucal AI')).toHaveClass('font-semibold')
    expect(screen.getByText('Eucal AI')).not.toHaveClass('font-bold')
  })

  it('supports an inverse mark for dark backgrounds', () => {
    render(<BrandLogo markTone="inverse" />)

    expect(screen.getByText('/')).toHaveClass('bg-white', 'text-[#111827]')
  })

  it('renders a custom label', () => {
    render(<BrandLogo label="TierFlow" />)

    expect(screen.getByText('/')).toBeInTheDocument()
    expect(screen.getByText('TierFlow')).toBeInTheDocument()
  })

  it('keeps every slash mark size aligned to the site logo standard', () => {
    render(
      <>
        <BrandMark size="sm" data-testid="mark-sm" />
        <BrandMark size="md" data-testid="mark-md" />
        <BrandMark size="lg" data-testid="mark-lg" />
        <BrandMark size="hero" data-testid="mark-hero" />
      </>
    )

    for (const size of ['sm', 'md', 'lg', 'hero']) {
      expect(screen.getByTestId(`mark-${size}`)).toHaveClass('h-7', 'w-7', 'rounded-md', 'text-base')
    }
  })
})
