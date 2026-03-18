'use client'

import { useEffect, useState } from 'react'
import { EandLogo } from '@/components/ui/eand-logo'

export function CompletionScreen() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowContent(true), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Confetti particles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            >
              <div
                className="w-2 h-2 md:w-3 md:h-3 rounded-sm"
                style={{
                  backgroundColor: ['#C9A84C', '#E00800', '#47CB6C', '#18114B', '#7C0124', '#D18D86'][
                    Math.floor(Math.random() * 6)
                  ],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {showContent && (
        <div className="text-center z-10 animate-scale-in">
          {/* Trophy */}
          <div className="text-7xl md:text-8xl mb-6 animate-bounce">🏆</div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Thank You!
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-md mx-auto mb-3 leading-relaxed">
            Your feedback helps us create even better experiences.
          </p>
          <p className="text-ramadan-gold text-base font-semibold mb-10">
            Ramadan Kareem 🌙
          </p>

          {/* Stars */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {['⭐', '🌟', '✨', '🌟', '⭐'].map((star, i) => (
              <span
                key={i}
                className="text-2xl animate-twinkle"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {star}
              </span>
            ))}
          </div>

          {/* Logo */}
          <div className="flex flex-col items-center gap-3 opacity-50">
            <EandLogo size="md" className="brightness-0 invert" />
            <p className="text-white/30 text-xs">© 2026 e& Egypt</p>
          </div>
        </div>
      )}
    </div>
  )
}
