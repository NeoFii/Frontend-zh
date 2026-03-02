/**
 * 验证码倒计时组件
 * 发送验证码后的倒计时功能
 */

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface CodeCountdownProps {
  initialCountdown?: number
  onSendCode: () => Promise<void>
  disabled?: boolean
}

export function CodeCountdown({
  initialCountdown = 60,
  onSendCode,
  disabled = false
}: CodeCountdownProps) {
  const t = useTranslations('auth.login')
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
      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
    >
      {loading ? t('sending') : countdown > 0 ? `${countdown}s` : t('getCode')}
    </button>
  )
}
