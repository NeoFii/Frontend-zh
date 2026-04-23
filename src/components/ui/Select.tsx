'use client'

import { useEffect, useId, useRef, useState } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  triggerClassName?: string
  menuClassName?: string
  optionClassName?: string
  selectedOptionClassName?: string
  unselectedOptionClassName?: string
  menuAlign?: 'left' | 'right'
  fullWidth?: boolean
  matchTriggerWidth?: boolean
}

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function Select({
  value,
  onChange,
  options,
  placeholder = '请选择',
  className,
  ariaLabel,
  ariaLabelledBy,
  triggerClassName,
  menuClassName,
  optionClassName,
  selectedOptionClassName,
  unselectedOptionClassName,
  menuAlign = 'left',
  fullWidth = true,
  matchTriggerWidth = true,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const listboxId = `select-listbox-${useId()}`

  const selected = options.find((o) => o.value === value)
  const fallbackAccessibleName = selected?.label ?? placeholder

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div ref={ref} className={joinClasses('relative', className)}>
      <button
        type="button"
        role="combobox"
        aria-label={ariaLabel ?? (!ariaLabelledBy ? fallbackAccessibleName : undefined)}
        aria-labelledby={ariaLabelledBy}
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className={joinClasses(
          'flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-900 outline-none transition focus:border-gray-950',
          fullWidth && 'w-full',
          triggerClassName
        )}
      >
        <span className={selected ? undefined : 'text-gray-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={joinClasses('h-4 w-4 shrink-0 text-gray-400 transition-transform', open && 'rotate-180')}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          className={joinClasses(
            'absolute top-full z-50 mt-1 rounded-xl border border-gray-100 bg-white py-1 shadow-lg',
            menuAlign === 'right' ? 'right-0' : 'left-0',
            matchTriggerWidth && 'min-w-full',
            menuClassName
          )}
        >
          {options.map((option) => {
            const isActive = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={joinClasses(
                  'flex w-full items-center px-3 py-2 text-left text-sm transition',
                  optionClassName,
                  isActive ? 'bg-gray-950 text-white' : 'text-gray-700 hover:bg-gray-50',
                  isActive ? selectedOptionClassName : unselectedOptionClassName
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
