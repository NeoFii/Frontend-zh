interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  className?: string
}

export default function StatCard({ label, value, hint, className = '' }: StatCardProps) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-5 ${className}`}>
      <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-gray-950">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
