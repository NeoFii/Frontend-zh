import Link from 'next/link'
import type { ReactNode } from 'react'

export const LoadingState = ({ label }: { label: string }) => (
  <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#f8fafc] text-[#6b7280]">
    <div className="flex items-center gap-3">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#f97316] border-t-transparent" />
      <span className="font-mono text-xs uppercase tracking-[0.12em]">{label}</span>
    </div>
  </div>
)

interface AuthLayoutProps {
  heading: ReactNode
  subtitle: string
  terminal: ReactNode
  switchLabel: string
  switchLinkText: string
  switchHref: string
  footerRight: string
  children: ReactNode
}

export default function AuthLayout({
  heading,
  subtitle,
  terminal,
  switchLabel,
  switchLinkText,
  switchHref,
  footerRight,
  children,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 bg-[#f8fafc] text-[#111827] lg:grid-cols-2">
      <aside className="relative hidden min-h-[720px] overflow-hidden bg-[#111827] p-12 text-white lg:flex lg:flex-col">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(rgba(248,250,252,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            WebkitMaskImage: 'radial-gradient(ellipse at 40% 30%, #000 30%, transparent 80%)',
            maskImage: 'radial-gradient(ellipse at 40% 30%, #000 30%, transparent 80%)',
          }}
        />
        <div className="relative z-10 mb-20 flex items-center gap-2.5 text-base font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[#f97316] font-mono font-bold text-[#111827]">/</span>
          <span>TierFlow</span>
        </div>
        <div className="relative z-10">
          <h2 className="mb-6 max-w-[15ch] text-[clamp(28px,3vw,40px)] font-medium leading-[1.1] tracking-[-0.02em]">
            {heading}
          </h2>
          <p className="max-w-[42ch] text-[14.5px] leading-[1.55] text-white/65">
            {subtitle}
          </p>
        </div>
        {terminal}
      </aside>

      <section className="flex min-h-[680px] flex-col px-6 py-10 sm:px-10 lg:p-12">
        <div className="mb-auto flex items-center justify-between gap-4 pb-12">
          <Link href="/" className="flex items-center gap-2.5 text-base font-semibold text-[#111827]">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[#111827] font-mono font-bold text-white">/</span>
            <span>TierFlow</span>
          </Link>
          <span className="font-mono text-[13px] text-[#6b7280]">
            {switchLabel}
            <Link href={switchHref} className="text-[#111827]">{switchLinkText}</Link>
          </span>
        </div>

        <div className="mx-auto w-full max-w-[400px] py-10">
          {children}
        </div>

        <div className="mt-auto flex justify-between pt-6 font-mono text-xs text-[#9ca3af]">
          <span>&copy; 2026 Eucal AI</span>
          <span>{footerRight}</span>
        </div>
      </section>
    </div>
  )
}
