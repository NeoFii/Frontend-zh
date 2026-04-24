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

  it('supports fixed mark sizes', () => {
    render(<BrandMark size="hero" />)

    expect(screen.getByText('/')).toHaveClass('h-28', 'w-28', 'text-5xl')
  })
})
