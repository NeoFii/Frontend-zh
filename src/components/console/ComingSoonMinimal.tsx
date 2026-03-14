'use client'

interface ComingSoonMinimalProps {
  badge?: string
  title: string
}

export default function ComingSoonMinimal(props: ComingSoonMinimalProps) {
  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <section className="overflow-hidden rounded-[32px] border border-gray-200 bg-[radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_30%),linear-gradient(145deg,#ffffff_0%,#f8fafc_100%)] p-8 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.22)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-gray-950 px-3 py-1 text-xs font-medium tracking-[0.24em] text-white">
              {props.badge || 'IN DEVELOPMENT'}
            </div>
            <h2 className="mt-5 text-[1.75rem] tracking-tight text-gray-950">{props.title}</h2>
          </div>
        </div>
      </section>
    </div>
  )
}
