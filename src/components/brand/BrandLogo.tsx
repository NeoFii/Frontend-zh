import type { ComponentPropsWithoutRef } from 'react'

type BrandLogoSize = 'sm' | 'md' | 'lg' | 'hero'
type BrandMarkTone = 'default' | 'inverse'

const markSizeClasses: Record<BrandLogoSize, string> = {
  sm: 'h-7 w-7 rounded-md text-base',
  md: 'h-9 w-9 rounded-md text-xl',
  lg: 'h-16 w-16 rounded-2xl text-2xl',
  hero: 'h-28 w-28 rounded-[1.5rem] text-5xl',
}

const labelSizeClasses: Record<Exclude<BrandLogoSize, 'hero'>, string> = {
  sm: 'text-xl',
  md: 'text-xl',
  lg: 'text-2xl',
}

const markToneClasses: Record<BrandMarkTone, string> = {
  default: 'bg-[#111827] text-white',
  inverse: 'bg-white text-[#111827]',
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
        'grid place-items-center font-mono font-bold',
        markSizeClasses[size],
        markToneClasses[tone],
        className
      )}
      {...props}
    >
      /
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
