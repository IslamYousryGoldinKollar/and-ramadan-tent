'use client'

import { useEffect, useState } from 'react'
import { EandLogo } from '@/components/ui/eand-logo'

export function CompletionScreen() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Soft floating lanterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-16 left-[15%] text-3xl opacity-20 animate-float">🏮</div>
        <div className="absolute top-24 right-[20%] text-2xl opacity-15 animate-float-slow delay-500">🏮</div>
        <div className="absolute bottom-32 left-[25%] text-2xl opacity-10 animate-float delay-300">✨</div>
        <div className="absolute bottom-24 right-[15%] text-3xl opacity-15 animate-float-slow delay-700">✨</div>
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-ramadan-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-36 h-36 bg-ramadan-gold/5 rounded-full blur-3xl" />
      </div>

      {showContent && (
        <div className="text-center z-10 animate-fade-in-up">
          {/* Crescent */}
          <div className="text-5xl md:text-6xl mb-8">{'\u{1F319}'}</div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            شكراً لك
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-ramadan-gold mb-6">
            Thank You
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-sm mx-auto mb-3 leading-relaxed">
            Your feedback means a lot to us and will help shape an even better Ramadan experience next year.
          </p>
          <p className="text-white/40 text-sm max-w-xs mx-auto mb-10 leading-relaxed">
            May the blessings of Ramadan stay with you throughout the year.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-12 bg-ramadan-gold/20" />
            <span className="text-ramadan-gold/40 text-xs">رمضان كريم</span>
            <div className="h-px w-12 bg-ramadan-gold/20" />
          </div>

          {/* Logo */}
          <div className="flex flex-col items-center gap-3 opacity-40">
            <EandLogo size="md" className="brightness-0 invert" />
            <p className="text-white/30 text-xs">© 2026 e& Egypt</p>
          </div>
        </div>
      )}
    </div>
  )
}
