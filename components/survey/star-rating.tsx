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

export function StarRating({ question, onRate, value, maxStars = 5, onFullMark }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const handleFullMark = () => {
    onRate(5)
    if (onFullMark) onFullMark()
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-eand-ocean/90 backdrop-blur-md rounded-2xl px-6 py-5 border border-white/[0.08]">
      <p className="text-[15px] font-medium text-white mb-5 text-center leading-relaxed">{question}</p>
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= (hovered ?? value ?? 0)

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
      {(hovered || value) && (
        <p className="text-center text-ramadan-gold/80 text-xs mt-2 animate-fade-in">
          {['', 'Good start', 'Enjoyable', 'Really great', 'Loved it', 'Outstanding'][hovered ?? value ?? 0]}
        </p>
      )}

      <button
        onClick={handleFullMark}
        className={cn(
          'mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300',
          value === 5
            ? 'bg-ramadan-gold/20 text-ramadan-gold border border-ramadan-gold/30'
            : 'bg-ramadan-gold/10 text-ramadan-gold/80 border border-ramadan-gold/20 hover:bg-ramadan-gold/20 hover:text-ramadan-gold hover:border-ramadan-gold/40'
        )}
      >
        <Sparkles className="w-4 h-4" />
        Absolutely Loved It!
        <Sparkles className="w-4 h-4" />
      </button>
      </div>
    </div>
  )
}
