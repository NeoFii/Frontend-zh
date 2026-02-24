/**
 * 注册错误提示组件
 * 统一展示错误消息
 */

interface RegisterErrorProps {
  error?: string
}

export function RegisterError({ error }: RegisterErrorProps) {
  if (!error) return null

  return (
    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
      {error}
    </div>
  )
}
