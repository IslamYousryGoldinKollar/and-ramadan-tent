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
    <div className="w-full max-w-md mx-auto">
      <p className="text-[15px] font-medium text-white/90 mb-6 text-center leading-relaxed">{question}</p>
      <div className="flex items-center justify-center gap-2">
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
                'relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300',
                isSelected
                  ? 'scale-110 bg-white/15'
                  : isHovered
                  ? 'scale-105 bg-white/[0.06]'
                  : 'bg-transparent hover:bg-white/[0.04]'
              )}
            >
              <span className={cn('text-2xl transition-transform duration-300', isSelected && 'scale-110')}>
                {item.emoji}
              </span>
              <span
                className={cn(
                  'text-[10px] font-medium transition-all duration-200',
                  isSelected ? 'text-ramadan-gold' : isHovered ? 'text-white/50' : 'text-white/25'
                )}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
