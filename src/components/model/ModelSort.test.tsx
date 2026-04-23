import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import ModelSort from './ModelSort'

describe('ModelSort', () => {
  it('shows the current selection and calls onChange with the next sort order', () => {
    const handleChange = jest.fn()

    render(<ModelSort value="desc" onChange={handleChange} />)

    const trigger = screen.getByRole('combobox', { name: '发布时间倒序' })
    expect(trigger).toHaveTextContent('发布时间倒序')

    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('option', { name: '发布时间正序' }))

    expect(handleChange).toHaveBeenCalledWith('asc')
  })
})
