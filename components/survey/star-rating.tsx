'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Star, Sparkles } from 'lucide-react'

interface StarRatingProps {
  question: string
  onRate: (rating: number) => void
  value?: number
  maxStars?: number
  onFullMark?: () => void
}

const STAR_LABELS = ['Disappointing', 'Below expectations', 'Acceptable', 'Loved it', 'Outstanding']

export function StarRating({ question, onRate, value, maxStars = 5, onFullMark }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const handleFullMark = () => {
    onRate(5)
    if (onFullMark) onFullMark()
  }

  const activeVal = hovered ?? value ?? 0

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-eand-ocean/90 backdrop-blur-md rounded-2xl px-6 py-5 border border-white/[0.08]">
      <p className="text-[15px] font-medium text-white mb-5 text-center leading-relaxed">{question}</p>

      {/* Anchor labels: left = negative/shameful, right = positive */}
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-[10px] text-red-400/60 font-medium">Disappointing</span>
        <span className="text-[10px] text-ramadan-gold/70 font-medium">Outstanding</span>
      </div>

      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= activeVal

          return (
            <button
              key={starValue}
              onClick={() => onRate(starValue)}
              onMouseEnter={() => setHovered(starValue)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'p-1.5 transition-all duration-300',
                isFilled ? 'scale-110' : 'scale-100 hover:scale-105'
              )}
            >
              <Star
                className={cn(
                  'w-9 h-9 md:w-10 md:h-10 transition-all duration-300',
                  isFilled
                    ? 'fill-ramadan-gold text-ramadan-gold drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]'
                    : 'fill-transparent text-white/20'
                )}
              />
            </button>
          )
        })}
      </div>
      {activeVal > 0 && (
        <p className={cn(
          'text-center text-xs mt-2 animate-fade-in font-medium',
          activeVal <= 2 ? 'text-red-400/70' : activeVal === 3 ? 'text-white/50' : 'text-ramadan-gold/80'
        )}>
          {STAR_LABELS[activeVal - 1]}
        </p>
      )}

      {/* Attractive Full Mark CTA with pulse */}
      <button
        onClick={handleFullMark}
        className={cn(
          'mt-4 w-full relative flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden',
          value === 5
            ? 'bg-ramadan-gold text-eand-ocean shadow-[0_0_20px_rgba(201,168,76,0.4)] border-0'
            : 'bg-gradient-to-r from-ramadan-gold/90 to-ramadan-gold text-eand-ocean shadow-[0_0_15px_rgba(201,168,76,0.25)] hover:shadow-[0_0_25px_rgba(201,168,76,0.5)] hover:scale-[1.02] active:scale-[0.98]'
        )}
      >
        {value !== 5 && (
          <span className="absolute inset-0 rounded-xl animate-pulse bg-ramadan-gold/20" />
        )}
        <Sparkles className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Absolutely Loved It!</span>
        <Sparkles className="w-4 h-4 relative z-10" />
      </button>
      </div>
    </div>
  )
}
