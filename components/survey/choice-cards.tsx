'use client'

import { cn } from '@/lib/utils'

interface ChoiceCardsProps {
  question: string
  onRate: (rating: number) => void
  value?: number
  choices?: { label: string; description?: string }[]
}

const defaultChoices = [
  { label: 'Not for me', description: 'Didn\'t connect with it' },
  { label: 'It was okay', description: 'Some parts were nice' },
  { label: 'Enjoyed it', description: 'Had a good time' },
  { label: 'Loved it', description: 'Really memorable' },
  { label: 'Best part!', description: 'Absolute highlight' },
]

export function ChoiceCards({ question, onRate, value, choices = defaultChoices }: ChoiceCardsProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <p className="text-[15px] font-medium text-white/90 mb-6 text-center leading-relaxed">{question}</p>
      <div className="flex flex-col gap-2">
        {choices.map((choice, index) => {
          const rating = index + 1
          const isSelected = value === rating

          return (
            <button
              key={rating}
              onClick={() => onRate(rating)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl border transition-all duration-300',
                isSelected
                  ? 'bg-ramadan-gold/15 border-ramadan-gold/50 shadow-[0_0_12px_rgba(201,168,76,0.1)]'
                  : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/15'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300',
                    isSelected
                      ? 'border-ramadan-gold bg-ramadan-gold'
                      : 'border-white/20'
                  )}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-eand-ocean" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className={cn(
                    'text-sm font-medium transition-colors duration-300',
                    isSelected ? 'text-ramadan-gold' : 'text-white/80'
                  )}>
                    {choice.label}
                  </span>
                  {choice.description && (
                    <span className={cn(
                      'text-[11px] ml-2 transition-colors duration-300',
                      isSelected ? 'text-ramadan-gold/60' : 'text-white/30'
                    )}>
                      {choice.description}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
