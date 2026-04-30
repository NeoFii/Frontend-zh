import config from './tailwind.config'

describe('tailwind primary brand palette', () => {
  it('uses the homepage blue brand colors for global primary tokens', () => {
    const colors = config.theme?.extend?.colors as Record<string, unknown>
    expect(colors?.primary).toEqual({
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    })
  })
})
