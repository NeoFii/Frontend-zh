import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { RegisterForm } from './RegisterForm'
import { register } from '@/lib/api/auth'

const push = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

jest.mock('@/lib/api/auth', () => ({
  register: jest.fn(),
  sendVerificationCode: jest.fn(),
}))

describe('RegisterForm', () => {
  it('renders the login-aligned register form with all required entries', () => {
    render(React.createElement(RegisterForm))

    expect(screen.getByRole('heading', { name: '创建账户' })).toBeInTheDocument()
    expect(screen.getByText('使用邀请码开通你的 TierFlow 控制台。')).toBeInTheDocument()
    expect(screen.getByLabelText('邀请码')).toHaveAttribute('placeholder', '请输入邀请码')
    expect(screen.getByLabelText('邮箱')).toHaveAttribute('placeholder', '请输入邮箱')
    expect(screen.getByLabelText('验证码')).toHaveAttribute('placeholder', '请输入验证码')
    expect(screen.getByLabelText('密码')).toHaveAttribute('placeholder', '请设置密码（至少8位，含大小写字母、数字和特殊符号）')
    expect(screen.getByLabelText('确认密码')).toHaveAttribute('placeholder', '请再次输入密码')
    expect(screen.getByRole('button', { name: '获取验证码' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '立即注册' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '立即登录' })).toHaveAttribute('href', '/login')
  })

  it('blocks registration when password misses the backend complexity rules', () => {
    render(React.createElement(RegisterForm))

    fireEvent.change(screen.getByLabelText('邀请码'), { target: { value: 'invite-live' } })
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'user@example.com' } })
    fireEvent.change(screen.getByLabelText('验证码'), { target: { value: '123456' } })
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'Password1' } })
    fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: 'Password1' } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: '立即注册' }))

    expect(screen.getByText('密码需包含大写字母、小写字母、数字和特殊符号，且不少于8位')).toBeInTheDocument()
    expect(register).not.toHaveBeenCalled()
  })
})
