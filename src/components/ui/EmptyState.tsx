interface EmptyStateProps {
  title: string
  description?: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
      <p className="text-lg text-gray-900">{title}</p>
      {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
    </div>
  )
}
