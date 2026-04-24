import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from './page'

const mockChartRender = jest.fn()

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => (props: { option: unknown }) => {
    mockChartRender(props)
    return <div data-testid="benchmark-scatter-chart" />
  },
}))

jest.mock('echarts/core', () => ({
  use: jest.fn(),
}))

jest.mock('echarts/charts', () => ({
  ScatterChart: {},
}))

jest.mock('echarts/renderers', () => ({
  CanvasRenderer: {},
}))

jest.mock('echarts/components', () => ({
  GridComponent: {},
  LegendComponent: {},
  TooltipComponent: {},
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('next/image', () => {
  return function MockImage({
    alt,
    unoptimized,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { unoptimized?: boolean }) {
    void unoptimized
    return React.createElement('img', { alt, ...props })
  }
})

jest.mock('@/hooks/useUser', () => ({
  useUser: jest.fn(),
}))

jest.mock('@/stores/auth', () => ({
  useAuthStore: (selector: (state: { sessionStatus: string }) => unknown) =>
    selector({ sessionStatus: 'unauthenticated' }),
}))

jest.mock('@/components/Reveal', () => {
  return function MockReveal({ children }: { children: React.ReactNode }) {
    return React.createElement(React.Fragment, null, children)
  }
})

describe('Home', () => {
  beforeEach(() => {
    mockChartRender.mockClear()
  })

  it('lets the site layout own the semantic main landmark', () => {
    const { container } = render(React.createElement(Home))

    expect(container.querySelector('main')).not.toBeInTheDocument()
    expect(container.firstElementChild).toHaveClass('relative')
    expect(container.firstElementChild).toHaveClass('overflow-x-hidden')
  })

  it('renders the evidence-led SaaS homepage sections without layout chrome', () => {
    const { container } = render(React.createElement(Home))

    expect(container.querySelector('footer')).not.toBeInTheDocument()
    expect(screen.getByText('更高任务成功率')).toBeInTheDocument()
    expect(screen.getByText('更低调用成本')).toBeInTheDocument()
    expect(screen.getByText('让智能体用对模型，而不是用贵模型')).toBeInTheDocument()
    expect(screen.getByText('PinchBench 实测')).toBeInTheDocument()
    expect(screen.getByText('OpenClaw')).toBeInTheDocument()
    expect(screen.getAllByText('88.7%').length).toBeGreaterThan(0)
    expect(screen.getAllByText('¥2.04').length).toBeGreaterThan(0)
    expect(screen.getByText('工作原理')).toBeInTheDocument()
    expect(screen.getByText('开发者接入')).toBeInTheDocument()
    expect(screen.getByText('nexus-auto')).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: '让 Eucal AI 接管下一次模型选择' })
    ).toBeInTheDocument()
    expect(screen.queryByText('routeai-auto')).not.toBeInTheDocument()
    expect(screen.queryByText('Product')).not.toBeInTheDocument()
    expect(screen.queryByText('Resources')).not.toBeInTheDocument()
  })

  it('passes benchmark scatter data to ECharts with corrected Eucal AI metrics', () => {
    render(React.createElement(Home))

    expect(screen.getByTestId('benchmark-scatter-chart')).toBeInTheDocument()
    const chartProps = mockChartRender.mock.calls[0][0]
    const option = chartProps.option as {
      series: Array<{
        data: Array<{ name: string; value: [number, number] }>
      }>
    }
    const points = option.series[0].data

    expect(points).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Eucal AI', value: [2.04, 88.7] }),
        expect.objectContaining({ name: 'Claude-opus-4.6' }),
        expect.objectContaining({ name: 'GPT-5.4' }),
      ])
    )
  })
})
