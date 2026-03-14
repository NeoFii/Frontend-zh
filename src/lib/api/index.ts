import { createApiClient, createHttpMethods } from '@/lib/api/client'

const apiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'
)

export default apiClient

export const http = createHttpMethods(apiClient)
