'use client'

export default function VoucherPage() {
  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_32%),linear-gradient(145deg,#ffffff_0%,#f8fafc_100%)] p-8 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.22)]">
        <div className="inline-flex rounded-full bg-gray-950 px-3 py-1 text-xs font-medium tracking-[0.24em] text-white">
          BENEFITS
        </div>
        <h2 className="mt-5 text-[1.75rem] tracking-tight text-gray-950">优惠券与活动权益</h2>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          在这里查看和管理你的优惠券、活动权益和折扣信息。
        </p>
      </section>

      <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
        <p className="text-lg text-gray-900">暂无优惠券</p>
        <p className="mt-2 text-sm text-gray-500">当前没有可用的优惠券或活动权益，请关注后续活动通知。</p>
      </div>
    </div>
  )
}
