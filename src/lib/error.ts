export function extractErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as { response?: { data?: { message?: string } }; message?: string }

    if (err.response?.data?.message) {
      return err.response.data.message
    }

    if (err.message?.includes('Network Error')) {
      return '网络请求失败，请检查网络连接'
    }

    if (err.message?.includes('timeout')) {
      return '请求超时，请稍后重试'
    }

    if (err.message) {
      return err.message
    }
  }

  return '操作失败，请稍后重试'
}
