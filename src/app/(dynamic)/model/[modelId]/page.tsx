import { notFound } from 'next/navigation'
import ModelDetailClient from './ModelDetailClient'

interface ModelDetailPageProps {
  params: {
    modelId: string
  }
}

export default function ModelDetailPage({ params }: ModelDetailPageProps) {
  const { modelId } = params

  if (!modelId) {
    notFound()
  }

  return <ModelDetailClient modelId={modelId} />
}
