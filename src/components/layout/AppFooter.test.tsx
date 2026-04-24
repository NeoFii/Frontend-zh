import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AppFooter from './AppFooter'

describe('AppFooter', () => {
  it('uses the shared slash logo instead of the old E mark', () => {
    render(<AppFooter />)

    expect(screen.getByText('/')).toHaveClass('bg-white', 'text-[#111827]')
    expect(screen.getByText('Eucal AI')).toHaveClass('text-white', 'font-semibold')
    expect(screen.getByText('Eucal AI')).not.toHaveClass('font-bold')
    expect(screen.queryByText('E')).not.toBeInTheDocument()
  })
})
