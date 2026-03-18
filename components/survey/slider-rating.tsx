'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SliderRatingProps {
  question: string
  onRate: (rating: number) => void
  value?: number
  labels?: string[]
  defaultValue?: number
}

const defaultLabels = ['It was nice', 'Enjoyed it', 'Really good', 'Loved it', 'Outstanding']

export function SliderRating({ question, onRate, value, labels = defaultLabels, defaultValue }: SliderRatingProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Visual default only — does NOT set value in parent state until user clicks
  const displayValue = value ?? defaultValue
  const activeIndex = hoveredIndex ?? (displayValue ? displayValue - 1 : -1)

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-eand-ocean/90 backdrop-blur-md rounded-2xl px-6 py-5 border border-white/[0.08]">
      <p className="text-[15px] font-medium text-white mb-6 text-center leading-relaxed">{question}</p>
      <div className="flex items-center gap-1.5">
        {labels.map((label, index) => {
          const rating = index + 1
          const isActive = index <= activeIndex
          const isSelected = value === rating

          return (
            <button
              key={rating}
              onClick={() => onRate(rating)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              <div
                className={cn(
                  'w-full h-2 rounded-full transition-all duration-300',
                  isActive
                    ? 'bg-ramadan-gold shadow-[0_0_8px_rgba(201,168,76,0.3)]'
                    : 'bg-white/10 group-hover:bg-white/20'
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-medium transition-all duration-200',
                  isSelected ? 'text-ramadan-gold' : isActive ? 'text-white/60' : 'text-white/25'
                )}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
      {value && (
        <p className="text-center text-ramadan-gold/80 text-xs mt-4 animate-fade-in">
          {labels[value - 1]}
        </p>
      )}
      </div>
    </div>
  )
}
