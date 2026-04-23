import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { Select } from './Select'

const options = [
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
  { value: 'claude-3-7-sonnet', label: 'Claude 3.7 Sonnet' },
]

describe('Select', () => {
  it('shows the placeholder when no option is selected', () => {
    render(
      <Select
        value=""
        onChange={jest.fn()}
        options={options}
        placeholder="全部模型"
        ariaLabel="模型筛选"
      />
    )

    expect(screen.getByRole('combobox', { name: '模型筛选' })).toHaveTextContent('全部模型')
  })

  it('opens and closes the listbox from the trigger', () => {
    render(
      <Select
        value=""
        onChange={jest.fn()}
        options={options}
        placeholder="全部模型"
        ariaLabel="模型筛选"
      />
    )

    const trigger = screen.getByRole('combobox', { name: '模型筛选' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('calls onChange when an option is selected', () => {
    const handleChange = jest.fn()

    render(
      <Select
        value=""
        onChange={handleChange}
        options={options}
        placeholder="全部模型"
        ariaLabel="模型筛选"
      />
    )

    fireEvent.click(screen.getByRole('combobox', { name: '模型筛选' }))
    fireEvent.click(screen.getByRole('option', { name: 'GPT-4.1 Mini' }))

    expect(handleChange).toHaveBeenCalledWith('gpt-4.1-mini')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes the listbox when clicking outside', () => {
    render(
      <Select
        value=""
        onChange={jest.fn()}
        options={options}
        placeholder="全部模型"
        ariaLabel="模型筛选"
      />
    )

    fireEvent.click(screen.getByRole('combobox', { name: '模型筛选' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('uses the associated label as the accessible name', () => {
    render(
      <>
        <label id="model-select-label">实际模型</label>
        <Select
          value=""
          onChange={jest.fn()}
          options={options}
          placeholder="全部模型"
          ariaLabelledBy="model-select-label"
        />
      </>
    )

    expect(screen.getByRole('combobox', { name: '实际模型' })).toBeInTheDocument()
  })
})
