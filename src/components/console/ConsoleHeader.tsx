'use client'

import Link from 'next/link'
import { BrandLogo } from '@/components/brand/BrandLogo'

export default function ConsoleHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-gray-200 bg-white/95 backdrop-blur" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex min-w-0 items-center gap-5">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo
              size="md"
              labelClassName="text-lg font-semibold text-gray-950"
              markClassName="shadow-[0_12px_24px_-16px_rgba(15,23,42,0.55)]"
            />
          </Link>

          <div className="hidden h-8 w-px bg-gray-200 lg:block" />

          <div className="hidden lg:block">
            <div className="inline-flex rounded-full bg-gray-950 px-2.5 py-1 text-[10px] font-medium tracking-[0.22em] text-white">
              CONSOLE
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://neofii.github.io/TierFlow-Doc/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-gray-950 md:inline-flex"
          >
            {'文档中心'}
          </a>
        </div>
      </div>
    </header>
  )
}
