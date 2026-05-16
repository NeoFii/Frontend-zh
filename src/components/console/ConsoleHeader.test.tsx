import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ConsoleHeader from './ConsoleHeader'

describe('ConsoleHeader', () => {
  it('uses the shared slash logo instead of the old E mark', () => {
    render(<ConsoleHeader />)

    expect(screen.getByText('/')).toHaveClass('bg-[#111827]', 'text-white')
    expect(screen.getByText('TierFlow')).toHaveClass('font-semibold')
    expect(screen.getByText('TierFlow')).not.toHaveClass('font-bold')
    expect(screen.queryByText('E')).not.toBeInTheDocument()
  })
})
