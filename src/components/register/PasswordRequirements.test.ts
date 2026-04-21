import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { PasswordRequirements } from './PasswordRequirements'

describe('PasswordRequirements', () => {
  it('shows every backend password rule separately', () => {
    render(React.createElement(PasswordRequirements, { password: 'Password1' }))

    expect(screen.getByText(/至少8个字符/)).toBeInTheDocument()
    expect(screen.getByText(/包含大写字母/)).toBeInTheDocument()
    expect(screen.getByText(/包含小写字母/)).toBeInTheDocument()
    expect(screen.getByText(/包含数字/)).toBeInTheDocument()
    expect(screen.getByText(/包含特殊符号/)).toBeInTheDocument()
  })
})
