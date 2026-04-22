interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
      {message}
      {onRetry && (
        <button onClick={onRetry} className="ml-2 font-medium text-red-700 hover:text-red-900">
          重试
        </button>
      )}
    </div>
  )
}
