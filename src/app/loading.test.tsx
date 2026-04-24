import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Loading from './loading'

describe('Loading', () => {
  it('uses the shared slash mark instead of the old E mark', () => {
    render(<Loading />)

    expect(screen.getByText('/')).toHaveClass('bg-[#111827]', 'text-white')
    expect(screen.queryByText('E')).not.toBeInTheDocument()
  })
})
