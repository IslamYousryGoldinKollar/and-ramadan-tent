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
    <div className="w-full">
      <p className="text-lg font-semibold text-white mb-6 text-center leading-relaxed">{question}</p>
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
                'relative p-1 transition-all duration-300',
                isFilled ? 'scale-110' : 'scale-100 hover:scale-105'
              )}
            >
              <Star
                className={cn(
                  'w-10 h-10 md:w-12 md:h-12 transition-all duration-300',
                  isFilled
                    ? 'fill-ramadan-gold text-ramadan-gold drop-shadow-[0_0_8px_rgba(201,168,76,0.6)]'
                    : 'fill-transparent text-white/25'
                )}
              />
              {isFilled && value === starValue && (
                <div className="absolute inset-0 animate-ping opacity-20">
                  <Star className="w-10 h-10 md:w-12 md:h-12 fill-ramadan-gold text-ramadan-gold" />
                </div>
              )}
            </button>
          )
        })}
      </div>
      {(hovered || value) && (
        <p className="text-center text-ramadan-gold/80 text-sm mt-3 animate-fade-in">
          {['', 'Needs Improvement', 'Fair', 'Good', 'Great', 'Excellent'][hovered ?? value ?? 0]}
        </p>
      )}
    </div>
  )
}
