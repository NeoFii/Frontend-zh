'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { useRouterKeys } from '@/hooks/useRouterKeys'
import { useRouterUsageSummary } from '@/hooks/useRouterUsage'
import { changePassword, resetPassword, sendResetPasswordCode, sendVerifyEmailCode, verifyEmail } from '@/lib/api/auth'
import { extractErrorMessage } from '@/lib/error'
import {
  countActiveKeys,
  extractCurrency,
  formatCompactNumber,
  formatCurrency,
  sumPrepaidBalance,
} from '@/lib/router-analytics'
import { clearAllTokens } from '@/lib/token'
import { useAuthStore } from '@/stores/auth'

function SummaryCard(props: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]">
      <p className="text-sm text-gray-500">{props.label}</p>
      <p className="mt-3 text-2xl tracking-tight text-gray-950">{props.value}</p>
      <p className="mt-2 text-xs leading-6 text-gray-400">{props.hint}</p>
    </div>
  )
}

function PasswordDialog(props: {
  open: boolean
  email: string
  submitting: boolean
  onClose: () => void
  onSuccess: () => Promise<void>
}) {
  const [mode, setMode] = useState<'current' | 'email'>('current')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [sendingCode, setSendingCode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!props.open) {
    return null
  }

  const resetForm = () => {
    setMode('current')
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setVerificationCode('')
    setSendingCode(false)
    setSaving(false)
    setMessage(null)
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    props.onClose()
  }

  const validatePassword = (): boolean => {
    if (!newPassword || !confirmPassword) {
      setError('请输入新密码并确认。')
      return false
    }
    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致。')
      return false
    }
    if (newPassword.length < 8) {
      setError('新密码至少需要 8 位。')
      return false
    }
    return true
  }

  const handleSendCode = async () => {
    if (!props.email) {
      setError('当前账户未检测到可用邮箱。')
      return
    }

    setError(null)
    setMessage(null)
    setSendingCode(true)
    try {
      const response = await sendResetPasswordCode(props.email)
      setMessage(response.message || '验证码已发送，请查收邮箱。')
    } catch (requestError) {
      setError(extractErrorMessage(requestError))
    } finally {
      setSendingCode(false)
    }
  }

  const handleSubmit = async () => {
    setError(null)
    setMessage(null)

    if (!validatePassword()) {
      return
    }

    setSaving(true)
    try {
      if (mode === 'current') {
        if (!oldPassword) {
          setError('请输入当前密码。')
          setSaving(false)
          return
        }

        await changePassword({
          old_password: oldPassword,
          new_password: newPassword,
        })
      } else {
        if (!props.email) {
          setError('当前账户未检测到可用邮箱。')
          setSaving(false)
          return
        }
        if (!verificationCode) {
          setError('请输入邮箱验证码。')
          setSaving(false)
          return
        }

        await resetPassword({
          email: props.email,
          code: verificationCode,
          new_password: newPassword,
        })
      }

      handleClose()
      await props.onSuccess()
    } catch (requestError) {
      setError(extractErrorMessage(requestError))
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_30px_90px_-36px_rgba(15,23,42,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full bg-gray-950 px-3 py-1 text-[11px] font-medium tracking-[0.24em] text-white">
              PASSWORD
            </div>
            <h3 className="mt-4 text-xl tracking-tight text-gray-950">修改登录密码</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              你可以通过当前密码完成修改，也可以通过邮箱验证码确认身份后重置密码。修改成功后需要重新登录。
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            关闭
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => {
              setMode('current')
              setError(null)
              setMessage(null)
            }}
            className={`rounded-lg border px-4 py-4 text-left transition ${
              mode === 'current'
                ? 'border-gray-950 bg-gray-950 text-white'
                : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <p className="text-sm font-medium">当前密码验证</p>
            <p className={`mt-1 text-xs leading-5 ${mode === 'current' ? 'text-slate-300' : 'text-gray-500'}`}>
              输入旧密码、新密码和确认密码。
            </p>
          </button>
          <button
            onClick={() => {
              setMode('email')
              setError(null)
              setMessage(null)
            }}
            className={`rounded-lg border px-4 py-4 text-left transition ${
              mode === 'email'
                ? 'border-gray-950 bg-gray-950 text-white'
                : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <p className="text-sm font-medium">邮箱验证码验证</p>
            <p className={`mt-1 text-xs leading-5 ${mode === 'email' ? 'text-slate-300' : 'text-gray-500'}`}>
              发送验证码到当前邮箱，再设置新密码。
            </p>
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          {mode === 'current' ? (
            <label className="grid gap-2">
              <span className="text-sm text-gray-600">当前密码</span>
              <input
                type="password"
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950"
                placeholder="请输入当前密码"
              />
            </label>
          ) : (
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <label className="grid gap-2">
                <span className="text-sm text-gray-600">邮箱验证码</span>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950"
                  placeholder="请输入邮箱验证码"
                />
              </label>
              <button
                onClick={handleSendCode}
                disabled={sendingCode || saving || props.submitting}
                className="rounded-full bg-gray-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {sendingCode ? '发送中...' : '发送验证码'}
              </button>
            </div>
          )}

          <label className="grid gap-2">
            <span className="text-sm text-gray-600">新密码</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950"
              placeholder="至少 8 位"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-gray-600">确认新密码</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950"
              placeholder="再次输入新密码"
            />
          </label>
        </div>

        {message ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>
        ) : null}
        {error ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={handleClose}
            className="rounded-full border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || props.submitting}
            className="rounded-full bg-gray-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {saving || props.submitting ? '处理中...' : '确认修改'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BasicInformationPage() {
  const router = useRouter()
  const { user, isLoading, isError, mutate } = useUser({ restoreSession: true })
  const { keys, isLoading: keysLoading } = useRouterKeys()
  const { summary, isLoading: summaryLoading } = useRouterUsageSummary()
  const logout = useAuthStore((state) => state.logout)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [verifySending, setVerifySending] = useState(false)
  const [verifySubmitting, setVerifySubmitting] = useState(false)
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  const handlePasswordSuccess = async () => {
    setPasswordSubmitting(true)
    try {
      clearAllTokens()
      logout()
      window.alert('密码修改成功，请重新登录。')
      router.replace('/login')
    } finally {
      setPasswordSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
        <div className="h-44 animate-pulse rounded-2xl bg-gray-100"></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-gray-100"></div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600" style={{ fontFamily: 'MiSans, sans-serif' }}>
        账户信息加载失败。
        <button onClick={() => mutate()} className="ml-2 font-medium text-red-700 hover:text-red-900">
          重试
        </button>
      </div>
    )
  }

  const activeKeyCount = countActiveKeys(keys)
  const prepaidBalance = sumPrepaidBalance(keys)
  const currency = extractCurrency(summary)
  const totalRequests = summary?.total_requests ?? 0
  const totalTokens = summary?.total_tokens ?? 0
  const totalCost = summary?.total_cost ?? 0
  const loading = keysLoading || summaryLoading

  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <PasswordDialog
        open={passwordDialogOpen}
        email={user?.email || ''}
        submitting={passwordSubmitting}
        onClose={() => setPasswordDialogOpen(false)}
        onSuccess={handlePasswordSuccess}
      />

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_32%),linear-gradient(145deg,#ffffff_0%,#f8fafc_100%)] p-8 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.22)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-gray-950 px-3 py-1 text-xs font-medium tracking-[0.24em] text-white">
              ACCOUNT OVERVIEW
            </div>
            <h2 className="mt-5 text-[1.75rem] tracking-tight text-gray-950">账户总览与 Router 摘要</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              这里集中展示当前账户身份、Router Key 状态、累计请求、Token 与费用摘要，作为整个控制台的统一入口。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/console/api/get-api')}
                className="rounded-full bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                管理 API Key
              </button>
              <button
                onClick={() => router.push('/console/payment/balance')}
                className="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                查看余额与账单
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-xl bg-gray-950 p-5 text-white">
              <p className="text-xs tracking-[0.24em] text-slate-400">账户身份</p>
              <p className="mt-3 text-lg">{user?.email || '-'}</p>
              <p className="mt-2 text-sm text-slate-300">UID {user?.uid || '-'} · 当前账户已登录</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs tracking-[0.24em] text-gray-400">结算币种</p>
              <p className="mt-3 text-lg text-gray-950">{currency}</p>
              <p className="mt-2 text-sm text-gray-500">费用与余额面板都会按后端返回币种显示。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="活跃 API Key" value={loading ? '...' : String(activeKeyCount)} hint="当前启用中的 Router Key 数量" />
        <SummaryCard label="总请求数" value={loading ? '...' : formatCompactNumber(totalRequests)} hint="累计成功与失败请求" />
        <SummaryCard label="总 Tokens" value={loading ? '...' : formatCompactNumber(totalTokens)} hint="累计输入与输出 Token" />
        <SummaryCard label="总费用" value={loading ? '...' : formatCurrency(totalCost, currency)} hint="Router 汇总账单" />
        <SummaryCard label="预付费余额" value={loading ? '...' : formatCurrency(prepaidBalance, currency)} hint="所有 prepaid Key 余额之和" />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <h3 className="text-lg text-gray-900">账户信息</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">邮箱</p>
              <p className="mt-2 text-sm text-gray-900">{user?.email || '-'}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">用户 UID</p>
              <p className="mt-2 text-sm text-gray-900">{user?.uid || '-'}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">账户状态</p>
              <p className={`mt-2 text-sm ${user?.status === 1 ? 'text-emerald-600' : 'text-red-600'}`}>
                {user?.status === 1 ? '正常' : '已禁用'}
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">认证状态</p>
              <p className={`mt-2 text-sm ${user?.email_verified_at ? 'text-emerald-600' : 'text-amber-600'}`}>
                {user?.email_verified_at ? '邮箱已验证' : '邮箱未验证'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.35)]">
          <h3 className="text-lg text-gray-900">安全与管理</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">登录密码</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">建议定期更新密码，并避免与其他平台复用相同密码。</p>
              <button
                onClick={() => setPasswordDialogOpen(true)}
                className="mt-4 rounded-full bg-gray-950 px-4 py-2 text-sm text-white transition hover:bg-gray-800"
              >
                修改密码
              </button>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">邮箱绑定</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">当前绑定邮箱为 {user?.email || '-'}，用于登录和验证码验证。</p>
              {user?.email_verified_at ? (
                <div className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                  已验证
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        placeholder="输入 6 位验证码"
                        maxLength={6}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-gray-950"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        if (!user?.email) return
                        setVerifySending(true)
                        setVerifyError(null)
                        try {
                          await sendVerifyEmailCode(user.email)
                          setVerifyMessage('验证码已发送到邮箱。')
                        } catch (err) {
                          setVerifyError(extractErrorMessage(err))
                        } finally {
                          setVerifySending(false)
                        }
                      }}
                      disabled={verifySending}
                      className="rounded-full bg-gray-950 px-4 py-2.5 text-sm text-white transition hover:bg-gray-800 disabled:bg-gray-300"
                    >
                      {verifySending ? '发送中...' : '发送验证码'}
                    </button>
                  </div>
                  <button
                    onClick={async () => {
                      if (!user?.email || !verifyCode.trim()) return
                      setVerifySubmitting(true)
                      setVerifyError(null)
                      setVerifyMessage(null)
                      try {
                        await verifyEmail({ email: user.email, code: verifyCode.trim() })
                        setVerifyMessage('邮箱验证成功。')
                        setVerifyCode('')
                        mutate()
                      } catch (err) {
                        setVerifyError(extractErrorMessage(err))
                      } finally {
                        setVerifySubmitting(false)
                      }
                    }}
                    disabled={verifySubmitting || !verifyCode.trim()}
                    className="rounded-full bg-gray-950 px-4 py-2 text-sm text-white transition hover:bg-gray-800 disabled:bg-gray-300"
                  >
                    {verifySubmitting ? '验证中...' : '验证邮箱'}
                  </button>
                  {verifyMessage && <p className="text-xs text-emerald-600">{verifyMessage}</p>}
                  {verifyError && <p className="text-xs text-red-600">{verifyError}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
