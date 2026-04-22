interface ConsolePageHeaderProps {
  badge: string
  title: string
  description: string
}

export default function ConsolePageHeader({ badge, title, description }: ConsolePageHeaderProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_32%),linear-gradient(145deg,#ffffff_0%,#f8fafc_100%)] p-8 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.22)]">
      <div className="inline-flex rounded-full bg-gray-950 px-3 py-1 text-xs font-medium tracking-[0.24em] text-white">
        {badge}
      </div>
      <h2 className="mt-5 text-[1.75rem] tracking-tight text-gray-950">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-gray-600">{description}</p>
    </section>
  )
}
