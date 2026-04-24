import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import BasicInformationPage from './page'

const mockReplace = jest.fn()
const mockLogout = jest.fn()
const mockMutate = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}))

jest.mock('@/hooks/useUser', () => ({
  useUser: () => ({
    user: {
      uid: '1001',
      email: 'user@example.com',
      status: 1,
      email_verified_at: '2026-04-20T10:00:00Z',
      last_login_at: '2026-04-23T08:00:00Z',
      created_at: '2026-04-01T09:00:00Z',
    },
    isLoading: false,
    isError: null,
    mutate: mockMutate,
  }),
}))

jest.mock('@/stores/auth', () => ({
  useAuthStore: (selector: (state: { logout: typeof mockLogout }) => unknown) =>
    selector({ logout: mockLogout }),
}))

describe('BasicInformationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('focuses on user information without router billing summary content', () => {
    render(<BasicInformationPage />)

    expect(screen.getByRole('heading', { name: '用户信息' })).toBeInTheDocument()
    expect(screen.getByText('user@example.com')).toBeInTheDocument()
    expect(screen.getByText('1001')).toBeInTheDocument()
    expect(screen.getByText('正常')).toBeInTheDocument()
    expect(screen.getByText('邮箱已验证')).toBeInTheDocument()

    expect(screen.queryByText('账户总览与 Router 摘要')).not.toBeInTheDocument()
    expect(screen.queryByText('这里集中展示当前账户身份、Router Key 状态、累计请求、Token 与费用摘要，作为整个控制台的统一入口。')).not.toBeInTheDocument()
    expect(screen.queryByText('管理 API Key')).not.toBeInTheDocument()
    expect(screen.queryByText('查看余额与账单')).not.toBeInTheDocument()
    expect(screen.queryByText('结算币种')).not.toBeInTheDocument()
    expect(screen.queryByText('活跃 API Key')).not.toBeInTheDocument()
    expect(screen.queryByText('总请求数')).not.toBeInTheDocument()
    expect(screen.queryByText('总 Tokens')).not.toBeInTheDocument()
    expect(screen.queryByText('总费用')).not.toBeInTheDocument()
    expect(screen.queryByText('预付费余额')).not.toBeInTheDocument()
  })

  it('keeps a single cancel action in the change password dialog', () => {
    render(<BasicInformationPage />)

    fireEvent.click(screen.getByRole('button', { name: '修改密码' }))

    expect(screen.getByRole('heading', { name: '修改登录密码' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '关闭' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument()
  })
})
