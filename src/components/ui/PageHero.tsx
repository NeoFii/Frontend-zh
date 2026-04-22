'use client'

import { useState, useEffect, ReactNode } from 'react'

interface PageHeroProps {
  badge: string
  title: string
  subtitle?: string
  description?: string
  children?: ReactNode
}

export default function PageHero({ badge, title, subtitle, description, children }: PageHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => { setIsLoaded(true) }, [])

  return (
    <>
      {/* Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] opacity-40 pointer-events-none -z-10 flex justify-center">
        <div className="absolute top-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-violet-400/20 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      <div
        className={`relative z-10 px-6 lg:px-0 w-full max-w-[1000px] flex flex-col items-center mt-[80px] mb-[48px] transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} delay-200`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200/50 text-blue-600 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          {badge}
        </div>

        <h1 className="m-0 p-0 text-center text-5xl md:text-6xl font-extrabold tracking-tight leading-tight pb-4 max-w-[900px]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
            {title}
          </span>
        </h1>

        {(subtitle || description) && (
          <div className="flex flex-col items-center max-w-[700px] space-y-2 mt-4">
            {subtitle && (
              <p className="text-slate-800 text-lg md:text-xl font-medium text-center">{subtitle}</p>
            )}
            {description && (
              <p className="text-slate-500 text-base font-normal leading-relaxed text-center">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </>
  )
}
