'use client'

interface ComingSoonPanelProps {
  badge?: string
  title: string
  description?: string
  primaryLabel?: string
  points?: Array<{
    title: string
    description: string
  }>
}

export default function ComingSoonPanel(props: ComingSoonPanelProps) {
  return (
    <div className="space-y-6" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-[radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_30%),linear-gradient(145deg,#ffffff_0%,#f8fafc_100%)] p-8 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.22)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-gray-950 px-3 py-1 text-xs font-medium tracking-[0.24em] text-white">
              {props.badge || 'COMING SOON'}
            </div>
            <h2 className="mt-5 text-[1.75rem] tracking-tight text-gray-950">{props.title}</h2>
            {props.description ? <p className="mt-3 text-sm leading-7 text-gray-600">{props.description}</p> : null}
          </div>
          {props.primaryLabel ? (
            <div className="rounded-3xl border border-gray-200 bg-white/80 px-5 py-4 text-sm text-gray-600 backdrop-blur-sm">
              <p className="font-medium text-gray-900">{props.primaryLabel}</p>
            </div>
          ) : null}
        </div>
      </section>

      {props.points && props.points.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {props.points.map((point) => (
            <div
              key={point.title}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.32)]"
            >
              <p className="text-lg text-gray-900">{point.title}</p>
              <p className="mt-3 text-sm leading-7 text-gray-500">{point.description}</p>
            </div>
          ))}
        </section>
      ) : null}
    </div>
  )
}
