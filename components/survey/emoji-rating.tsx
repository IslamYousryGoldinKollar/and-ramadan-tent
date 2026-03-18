'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface EmojiRatingProps {
  question: string
  onRate: (rating: number) => void
  value?: number
}

const emojis = [
  { emoji: '\u{1F60A}', label: 'Good' },
  { emoji: '\u{1F60D}', label: 'Great' },
  { emoji: '\u{1F929}', label: 'Really great' },
  { emoji: '\u{1F970}', label: 'Amazing' },
  { emoji: '\u{2B50}', label: 'Incredible' },
]

export function EmojiRating({ question, onRate, value }: EmojiRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-eand-ocean/90 backdrop-blur-md rounded-2xl px-6 py-5 border border-white/[0.08]">
      <p className="text-[15px] font-medium text-white mb-5 text-center leading-relaxed">{question}</p>
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
    </div>
  )
}
