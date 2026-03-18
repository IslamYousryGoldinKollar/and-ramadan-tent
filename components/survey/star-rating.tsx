'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface StarRatingProps {
  question: string
  onRate: (rating: number) => void
  value?: number
  maxStars?: number
}

export function StarRating({ question, onRate, value, maxStars = 5 }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="w-full max-w-md mx-auto">
      <p className="text-[15px] font-medium text-white/90 mb-6 text-center leading-relaxed">{question}</p>
      <div className="flex items-center justify-center gap-1.5">
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
                'p-1 transition-all duration-300',
                isFilled ? 'scale-110' : 'scale-100 hover:scale-105'
              )}
            >
              <Star
                className={cn(
                  'w-8 h-8 md:w-9 md:h-9 transition-all duration-300',
                  isFilled
                    ? 'fill-ramadan-gold text-ramadan-gold drop-shadow-[0_0_6px_rgba(201,168,76,0.4)]'
                    : 'fill-transparent text-white/15'
                )}
              />
            </button>
          )
        })}
      </div>
      {(hovered || value) && (
        <p className="text-center text-ramadan-gold/60 text-xs mt-3 animate-fade-in">
          {['', 'Needs Improvement', 'Fair', 'Good', 'Great', 'Excellent'][hovered ?? value ?? 0]}
        </p>
      )}
    </div>
  )
}
