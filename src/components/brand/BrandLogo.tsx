import type { ComponentPropsWithoutRef } from 'react'

type BrandLogoSize = 'sm' | 'md' | 'lg' | 'hero'
type BrandMarkTone = 'default' | 'inverse'

const markSizeClasses: Record<BrandLogoSize, string> = {
  sm: 'h-7 w-7 rounded-md p-1',
  md: 'h-7 w-7 rounded-md p-1',
  lg: 'h-9 w-9 rounded-lg p-1.5',
  hero: 'h-14 w-14 rounded-xl p-2.5',
}

const labelSizeClasses: Record<Exclude<BrandLogoSize, 'hero'>, string> = {
  sm: 'text-xl',
  md: 'text-xl',
  lg: 'text-2xl',
}

const markToneClasses: Record<BrandMarkTone, string> = {
  default: 'bg-[#111827]',
  inverse: 'bg-white',
}

const svgFillClasses: Record<BrandMarkTone, string> = {
  default: 'fill-white',
  inverse: 'fill-[#111827]',
}

const joinClasses = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(' ')

interface BrandMarkProps extends ComponentPropsWithoutRef<'span'> {
  size?: BrandLogoSize
  tone?: BrandMarkTone
}

interface BrandLogoProps extends ComponentPropsWithoutRef<'span'> {
  label?: string
  labelClassName?: string
  markClassName?: string
  markTone?: BrandMarkTone
  size?: Exclude<BrandLogoSize, 'hero'>
}

export function BrandMark({ className, size = 'sm', tone = 'default', ...props }: BrandMarkProps) {
  return (
    <span
      className={joinClasses(
        'grid place-items-center',
        markSizeClasses[size],
        markToneClasses[tone],
        className
      )}
      {...props}
    >
      <svg viewBox="0 0 100 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={joinClasses('h-full w-full', svgFillClasses[tone])}>
        <g>
          <rect x="0" y="0" width="16" height="16" rx="8" />
          <rect x="24" y="0" width="76" height="16" rx="8" />
          <rect x="0" y="24" width="100" height="16" rx="8" />
          <rect x="0" y="48" width="16" height="16" rx="8" />
          <rect x="24" y="48" width="52" height="16" rx="8" />
          <rect x="84" y="48" width="16" height="16" rx="8" />
        </g>
      </svg>
    </span>
  )
}

export function BrandLogo({
  className,
  label = 'Eucal AI',
  labelClassName,
  markClassName,
  markTone = 'default',
  size = 'sm',
  ...props
}: BrandLogoProps) {
  return (
    <span className={joinClasses('flex items-center gap-3', className)} {...props}>
      <BrandMark size={size} tone={markTone} className={markClassName} />
      <span className={joinClasses('font-semibold tracking-tight', labelSizeClasses[size], labelClassName)}>
        {label}
      </span>
    </span>
  )
}
