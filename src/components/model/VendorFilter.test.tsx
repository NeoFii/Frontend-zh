import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import VendorFilter from './VendorFilter'

const vendors = [
  { id: 1, slug: 'openai', name: 'OpenAI', is_active: true },
  { id: 2, slug: 'anthropic', name: 'Anthropic', is_active: true },
]

describe('VendorFilter', () => {
  it('keeps vendor actions while hiding developer-manufacturer wording', async () => {
    const onChange = jest.fn()

    const { rerender } = render(
      <VendorFilter vendors={vendors} selectedVendors={[]} onChange={onChange} />
    )

    expect(screen.queryByText('研发商')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '全选' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'OpenAI' }))

    expect(onChange).toHaveBeenCalledWith(['openai'])

    rerender(<VendorFilter vendors={vendors} selectedVendors={['openai']} onChange={onChange} />)

    expect(screen.getByText('已选 1 个')).toBeInTheDocument()
    expect(screen.queryByText(/研发商/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '清除' })).toBeInTheDocument()
  })
})
