/**
 * 用户协议页面
 */

import LegalPage from '@/components/ui/LegalPage'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '用户协议 - Eucal AI',
    description: '请仔细阅读 Eucal AI 用户协议',
  }
}

export default async function AgreementPage() {
  return (
    <LegalPage
      title="用户协议"
      description="请仔细阅读 Eucal AI 用户协议"
      lastUpdated="最后更新日期"
      sections={[
        { title: '1. 协议范围', content: '本用户协议（以下简称「协议」）是您与 Eucal AI 之间就使用我们的 AI 推理优化平台服务达成的协议。通过访问或使用我们的服务，您同意受本协议条款的约束。' },
        { title: '2. 服务内容', content: 'Eucal AI 提供以下服务：', items: ['AI 大模型统一接口服务', '智能分层推理优化', 'API 密钥管理与用量统计'] },
        { title: '3. 用户责任', content: '您同意不会使用我们的服务进行任何非法活动，包括但不限于：发送垃圾邮件、传播恶意软件、侵犯他人知识产权或隐私权。您应对您通过 API 发送的所有内容负责。' },
        { title: '4. 服务限制', content: '我们保留随时修改、暂停或终止服务的权利，恕不另行通知。我们可能会对 API 调用频率、并发数等进行限制，以确保服务的稳定性。' },
        { title: '5. 免责声明', content: 'Eucal AI 按「现状」提供服务，不作任何明示或暗示的保证。我们不对因使用或无法使用服务而导致的任何直接、间接、偶然、特殊或后果性损害负责。' },
      ]}
    />
  )
}
