import proxyConfig from '@/lib/proxy-config'

export const DEFAULT_USER_API_BASE_URL = proxyConfig.DEFAULT_PUBLIC_API_BASE_URL

// 站点配置
export const siteConfig = {
  // 公司信息
  company: {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'TierFlow',
    slogan: '智能 · 创新 · 未来',
    description: '致力于为企业提供高性能 AI 推理优化方案，推动智能化转型。',
  },

  // 联系信息
  contact: {
    address: '北京市朝阳区科技园区88号',
    email: 'contact@eucal.ai',
    phone: '400-888-8888',
    businessHours: '周一至周五 9:00-18:00',
  },

  // 备案信息（中国网站需要）
  icp: '',

  // 版权信息
  copyright: `© ${new Date().getFullYear()} TierFlow. All rights reserved.`,
}
