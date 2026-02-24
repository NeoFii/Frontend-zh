/**
 * 登录错误提示组件
 * 统一展示成功消息和错误消息
 */

interface LoginErrorProps {
  error?: string
  successMessage?: string
}

export function LoginError({ error, successMessage }: LoginErrorProps) {
  if (!error && !successMessage) return null

  return (
    <div className={`p-3 border rounded-xl text-sm ${
      successMessage
        ? 'bg-green-50 border-green-200 text-green-600'
        : 'bg-red-50 border-red-200 text-red-600'
    }`}>
      {successMessage || error}
    </div>
  )
}
