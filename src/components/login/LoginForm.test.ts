import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('renders the TierFlow-style login shell while keeping password and code login entries', () => {
    render(React.createElement(LoginForm, { onSuccess: jest.fn() }))

    expect(screen.getByRole('heading', { name: '欢迎回来' })).toBeInTheDocument()
    expect(screen.getByText('使用你的账户继续。')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '密码登录' })).toHaveClass('border-[#f97316]')
    expect(screen.getByPlaceholderText('请输入邮箱')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('请输入密码')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '忘记密码？' })).toHaveAttribute('href', '/forgot-password')
    expect(screen.getByRole('link', { name: '立即注册' })).toHaveAttribute('href', '/register')

    fireEvent.click(screen.getByRole('button', { name: '验证码登录' }))

    expect(screen.getByRole('button', { name: '验证码登录' })).toHaveClass('border-[#f97316]')
    expect(screen.getByPlaceholderText('请输入验证码')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '获取验证码' })).toBeInTheDocument()
  })
})
