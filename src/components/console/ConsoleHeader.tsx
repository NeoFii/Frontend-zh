'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { useTranslation } from '@/hooks/useTranslation'

export default function ConsoleHeader() {
  const { t } = useTranslation('console.header')
  const user = useAuthStore((state) => state.user)
  const logoutAsync = useAuthStore((state) => state.logoutAsync)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false)
    }, 300)
  }

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logoutAsync()
      window.location.href = '/login'
    } catch (error) {
      console.error('[Logout] ERROR:', error)
    }
  }

  const getUserDisplay = () => {
    if (user?.email) {
      const localPart = user.email.split('@')[0]
      if (/^[a-zA-Z]/.test(localPart)) {
        return localPart.charAt(0).toUpperCase()
      }
      return localPart.charAt(0)
    }
    return 'U'
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-gray-200 bg-white/95 backdrop-blur" style={{ fontFamily: 'MiSans, sans-serif' }}>
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex min-w-0 items-center gap-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(15,23,42,0.55)]">
              E
            </div>
            <span className="text-lg font-semibold tracking-tight text-gray-950">Eucal AI</span>
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
            {t('docs')}
          </a>

          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => {
              handleMouseEnter()
              setShowDropdown(true)
            }}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-3 rounded-full bg-white px-2.5 py-1.5 transition hover:bg-gray-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 text-sm font-medium text-white">
                {getUserDisplay()}
              </div>
              <div className="hidden max-w-[160px] text-left md:block">
                <p className="truncate text-sm font-medium text-gray-900">{user?.email || '当前账户'}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Account</p>
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-gray-200 bg-white py-2 shadow-[0_24px_44px_-24px_rgba(15,23,42,0.35)]">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                >
                  <svg className="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
