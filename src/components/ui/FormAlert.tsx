/**
 * 表单提示组件（通用）
 * 统一展示成功消息和错误消息
 */

interface FormAlertProps {
  error?: string
  success?: string
}

export function FormAlert({ error, success }: FormAlertProps) {
  if (!error && !success) return null

  return (
    <div className={`p-3 border rounded-xl text-sm ${
      success
        ? 'bg-green-50 border-green-200 text-green-600'
        : 'bg-red-50 border-red-200 text-red-600'
    }`}>
      {success || error}
    </div>
  )
}
