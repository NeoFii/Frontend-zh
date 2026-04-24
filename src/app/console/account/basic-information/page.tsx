'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { changePassword, resetPassword, sendResetPasswordCode, sendVerifyEmailCode, verifyEmail } from '@/lib/api/auth'
import { extractErrorMessage } from '@/lib/error'
import { validatePassword } from '@/lib/utils/validation'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { PasswordStrength } from '@/components/register/PasswordStrength'
import { PasswordRequirements } from '@/components/register/PasswordRequirements'
import { clearAllTokens } from '@/lib/token'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/components/ui/Toast'
import { formatShanghaiDateTime } from '@/lib/time'

function formatDateTime(value: string | null | undefined) {
  return formatShanghaiDateTime(value)
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

  const validateForm = (): boolean => {
    if (!newPassword || !confirmPassword) {
      setError('请输入新密码并确认。')
      return false
    }
    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致。')
      return false
    }
    if (!validatePassword(newPassword)) {
      setError('密码需包含大写字母、小写字母、数字和特殊符号，且不少于8位')
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

    if (!validateForm()) {
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
        <div>
          <div>
            <div className="inline-flex rounded-full bg-gray-950 px-3 py-1 text-[11px] font-medium tracking-[0.24em] text-white">
              PASSWORD
            </div>
            <h3 className="mt-4 text-xl tracking-tight text-gray-950">修改登录密码</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              你可以通过当前密码完成修改，也可以通过邮箱验证码确认身份后重置密码。修改成功后需要重新登录。
            </p>
          </div>
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
              <PasswordInput
                name="oldPassword"
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
                placeholder="请输入当前密码"
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 pr-12"
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

          <div className="grid gap-2">
            <span className="text-sm text-gray-600">新密码</span>
            <PasswordInput
              name="newPassword"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="含大小写字母、数字和特殊符号，不少于8位"
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 pr-12"
            />
            <PasswordStrength password={newPassword} />
            <PasswordRequirements password={newPassword} />
          </div>

          <label className="grid gap-2">
            <span className="text-sm text-gray-600">确认新密码</span>
            <PasswordInput
              name="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="再次输入新密码"
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-950 pr-12"
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
  const logout = useAuthStore((state) => state.logout)
  const { showToast, ToastContainer } = useToast()
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
      showToast('密码修改成功，请重新登录', 'success')
      setTimeout(() => router.replace('/login'), 1500)
    } finally {
      setPasswordSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
        <div className="h-20 animate-pulse rounded-lg bg-gray-100"></div>
        <div className="h-72 animate-pulse rounded-lg bg-gray-100"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600" style={{ fontFamily: 'MiSans, sans-serif' }}>
        账户信息加载失败。
        <button onClick={() => mutate()} className="ml-2 font-medium text-red-700 hover:text-red-900">
          重试
        </button>
      </div>
    )
  }

  const userStatus = user?.status === 1 ? '正常' : '已禁用'
  const emailStatus = user?.email_verified_at ? '邮箱已验证' : '邮箱未验证'
  const rows = [
    { label: '邮箱', value: user?.email || '-' },
    { label: '用户 UID', value: user?.uid ? String(user.uid) : '-' },
    { label: '账户状态', value: userStatus, tone: user?.status === 1 ? 'text-emerald-600' : 'text-red-600' },
    {
      label: '认证状态',
      value: emailStatus,
      tone: user?.email_verified_at ? 'text-emerald-600' : 'text-amber-600',
    },
    { label: '注册时间', value: formatDateTime(user?.created_at) },
    { label: '最近登录', value: formatDateTime(user?.last_login_at) },
  ]

  return (
    <div className="space-y-8" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <ToastContainer />
      <PasswordDialog
        open={passwordDialogOpen}
        email={user?.email || ''}
        submitting={passwordSubmitting}
        onClose={() => setPasswordDialogOpen(false)}
        onSuccess={handlePasswordSuccess}
      />

      <section className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl tracking-tight text-gray-950">用户信息</h1>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="divide-y divide-gray-100">
          {rows.map((row) => (
            <div key={row.label} className="grid gap-2 px-6 py-5 md:grid-cols-[180px_1fr] md:items-center">
              <div className="text-sm text-gray-500">{row.label}</div>
              <div className={`text-sm text-gray-950 ${row.tone ?? ''}`}>{row.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg text-gray-950">安全设置</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid gap-4 px-6 py-5 md:grid-cols-[180px_1fr_auto] md:items-center">
            <div className="text-sm text-gray-500">登录密码</div>
            <div className="text-sm text-gray-700">用于账户登录和敏感操作确认。</div>
            <button
              onClick={() => setPasswordDialogOpen(true)}
              className="w-fit rounded-full bg-gray-950 px-4 py-2 text-sm text-white transition hover:bg-gray-800"
            >
              修改密码
            </button>
          </div>
          <div className="px-6 py-5">
            <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-start">
              <div className="text-sm text-gray-500">邮箱验证</div>
              {user?.email_verified_at ? (
                <div className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                  已验证
                </div>
              ) : (
                <div className="space-y-3">
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
