'use client'

import { cn } from '@/lib/utils'

interface ChoiceSelectorProps {
  question: string
  options: string[]
  value?: string
  onSelect: (value: string) => void
}

export function ChoiceSelector({ question, options, value, onSelect }: ChoiceSelectorProps) {
  return (
    <div className="w-full">
      <p className="text-lg font-semibold text-white mb-6 text-center leading-relaxed">{question}</p>
      <div className="flex flex-col gap-3 max-w-md mx-auto">
        {options.map((option) => {
          const isSelected = value === option
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={cn(
                'relative px-6 py-4 rounded-2xl text-left transition-all duration-300 border',
                isSelected
                  ? 'bg-ramadan-gold/20 border-ramadan-gold text-white shadow-lg shadow-ramadan-gold/10 scale-[1.02]'
                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center flex-shrink-0',
                    isSelected
                      ? 'border-ramadan-gold bg-ramadan-gold'
                      : 'border-white/30'
                  )}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-eand-ocean" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">{option}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
