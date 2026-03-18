'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  title: string
  subtitle: string
  emoji: string
  color: string
  children: ReactNode
  isActive: boolean
  direction: 'left' | 'right' | 'none'
}

const bgGradients: Record<string, string> = {
  purple: 'from-purple-900/90 via-eand-ocean to-purple-950/90',
  amber: 'from-amber-900/80 via-eand-ocean to-amber-950/80',
  blue: 'from-blue-900/80 via-eand-ocean to-blue-950/80',
  red: 'from-red-900/70 via-eand-ocean to-red-950/80',
  emerald: 'from-emerald-900/70 via-eand-ocean to-emerald-950/80',
}

export function SectionWrapper({ title, subtitle, emoji, color, children, isActive, direction }: SectionWrapperProps) {
  const gradient = bgGradients[color] || bgGradients.purple

  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col transition-all duration-700 ease-out',
        isActive
          ? 'opacity-100 translate-x-0 scale-100'
          : direction === 'left'
          ? 'opacity-0 -translate-x-full scale-95 pointer-events-none'
          : direction === 'right'
          ? 'opacity-0 translate-x-full scale-95 pointer-events-none'
          : 'opacity-0 scale-95 pointer-events-none'
      )}
    >
      <div className={cn('flex-1 bg-gradient-to-b', gradient, 'overflow-y-auto')}>
        <div className="content-container py-8 flex flex-col items-center min-h-full">
          {/* Section header */}
          <div className="text-center mb-8 animate-fade-in-down">
            <span className="text-4xl mb-3 block">{emoji}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h2>
            <p className="text-white/60 text-sm md:text-base max-w-md mx-auto">{subtitle}</p>
          </div>

          {/* Content */}
          <div className="w-full flex-1 flex flex-col gap-8 pb-32">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
