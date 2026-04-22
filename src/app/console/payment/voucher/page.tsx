'use client'

import ConsolePageHeader from '@/components/ui/ConsolePageHeader'
import EmptyState from '@/components/ui/EmptyState'

export default function VoucherPage() {
  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <ConsolePageHeader badge="BENEFITS" title="优惠券与活动权益" description="在这里查看和管理你的优惠券、活动权益和折扣信息。" />

      <EmptyState title="暂无优惠券" description="当前没有可用的优惠券或活动权益，请关注后续活动通知。" />
    </div>
  )
}
