import { createApiClient, createHttpMethods } from '@/lib/api/client'
import proxyConfig from '@/lib/proxy-config'

const apiClient = createApiClient(proxyConfig.resolvePublicApiBaseUrl())

export default apiClient

export const http = createHttpMethods(apiClient)
