/**
 * 隐私政策页面
 */

import LegalPage from '@/components/ui/LegalPage'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '隐私政策 - Eucal AI',
    description: '了解 Eucal AI 如何保护您的隐私',
  }
}

export default async function PrivacyPage() {
  return (
    <LegalPage
      title="隐私政策"
      description="了解 Eucal AI 如何保护您的隐私"
      lastUpdated="最后更新日期"
      sections={[
        { title: '1. 信息收集', content: '我们收集您在使用服务时提供的信息，包括注册信息、API 调用记录、支付信息等。我们仅收集提供服务所必需的最少信息。' },
        { title: '2. 信息使用', content: '我们使用您的信息用于：', items: ['提供、维护和改进我们的服务', '处理支付和账单', '发送服务通知和更新'] },
        { title: '3. 信息保护', content: '我们采用行业标准的安全措施保护您的个人信息，包括数据加密、访问控制、安全审计等。您的 API 密钥以加密形式存储，我们不会存储您通过 API 传输的具体内容。' },
        { title: '4. 信息共享', content: '我们不会向第三方出售您的个人信息。仅在以下情况下可能会共享信息：获得您的明确同意、遵守法律法规要求、保护我们的合法权益。' },
        { title: '5. 您的权利', content: '您有权访问、更正、删除您的个人信息，以及撤回同意。如需行使这些权利，请通过 contact@eucal.ai 联系我们。' },
      ]}
    />
  )
}
