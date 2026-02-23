import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '控制台',
}

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
