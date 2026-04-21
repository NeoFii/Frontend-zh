/**
 * 验证码倒计时组件（通用）
 * 发送验证码后的倒计时功能
 */

import { useEffect, useState } from 'react'

interface CodeCountdownProps {
  initialCountdown?: number
  onSendCode: () => Promise<void>
  disabled?: boolean
  sendingText?: string
  getCodeText?: string
  className?: string
}

export function CodeCountdown({
  initialCountdown = 60,
  onSendCode,
  disabled = false,
  sendingText = '发送中...',
  getCodeText = '获取验证码',
  className = 'px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
}: CodeCountdownProps) {
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const handleClick = async () => {
    if (countdown > 0 || loading || disabled) return

    setLoading(true)
    try {
      await onSendCode()
      setCountdown(initialCountdown)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={countdown > 0 || loading || disabled}
      className={className}
    >
      {loading ? sendingText : countdown > 0 ? `${countdown}s` : getCodeText}
    </button>
  )
}
