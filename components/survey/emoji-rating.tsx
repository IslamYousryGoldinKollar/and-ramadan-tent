'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface EmojiRatingProps {
  question: string
  onRate: (rating: number) => void
  value?: number
}

const emojis = [
  { emoji: '😐', label: 'Okay', color: 'from-gray-100 to-gray-200' },
  { emoji: '🙂', label: 'Good', color: 'from-yellow-100 to-yellow-200' },
  { emoji: '😊', label: 'Great', color: 'from-amber-100 to-amber-200' },
  { emoji: '😍', label: 'Amazing', color: 'from-orange-100 to-orange-200' },
  { emoji: '🤩', label: 'Incredible', color: 'from-ramadan-gold/20 to-ramadan-gold/40' },
]

export function EmojiRating({ question, onRate, value }: EmojiRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="w-full">
      <p className="text-lg font-semibold text-white mb-6 text-center leading-relaxed">{question}</p>
      <div className="flex items-center justify-center gap-3">
        {emojis.map((item, index) => {
          const rating = index + 1
          const isSelected = value === rating
          const isHovered = hovered === rating

          return (
            <button
              key={rating}
              onClick={() => onRate(rating)}
              onMouseEnter={() => setHovered(rating)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'relative flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300',
                isSelected
                  ? 'scale-125 bg-white/20 shadow-lg shadow-ramadan-gold/20'
                  : isHovered
                  ? 'scale-110 bg-white/10'
                  : 'scale-100 bg-white/5 hover:bg-white/10'
              )}
            >
              <span
                className={cn(
                  'text-3xl md:text-4xl transition-transform duration-300',
                  isSelected && 'animate-bounce'
                )}
              >
                {item.emoji}
              </span>
              <span
                className={cn(
                  'text-[10px] font-medium transition-opacity duration-200',
                  isSelected ? 'text-ramadan-gold opacity-100' : 'text-white/50 opacity-0 group-hover:opacity-100',
                  (isHovered || isSelected) && 'opacity-100'
                )}
              >
                {item.label}
              </span>
              {isSelected && (
                <div className="absolute -inset-1 rounded-2xl border-2 border-ramadan-gold/50 animate-pulse" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
