import { http } from './index'
import type {
  ApiResponse,
  ContactForm,
  ContactFormResponse,
  ContactInfo
} from '@/types'

// 提交联系表单
export function submitContactForm(data: ContactForm): Promise<ContactFormResponse> {
  return http.post('/contact', data)
}

// 获取联系信息
export function fetchContactInfo(): Promise<ApiResponse<ContactInfo>> {
  return http.get('/contact/info')
}
