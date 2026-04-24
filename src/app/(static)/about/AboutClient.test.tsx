import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AboutClient from './AboutClient'

beforeAll(() => {
  window.requestAnimationFrame = (callback: FrameRequestCallback) => {
    return window.setTimeout(() => callback(window.performance.now()), 0)
  }
  window.cancelAnimationFrame = (handle: number) => window.clearTimeout(handle)
})

describe('AboutClient', () => {
  it('uses the shared hero slash mark in the brand visual card', () => {
    const { container } = render(<AboutClient />)

    expect(screen.getByText('/')).toHaveClass('h-28', 'w-28', 'text-5xl')
    expect(container.querySelector('.text-5xl.font-extrabold.text-white')).not.toBeInTheDocument()
  })
})
