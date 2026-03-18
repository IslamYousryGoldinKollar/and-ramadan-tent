'use client'

import { cn } from '@/lib/utils'

interface TextFeedbackProps {
  question: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TextFeedback({ question, value, onChange, placeholder = 'Share your thoughts...' }: TextFeedbackProps) {
  return (
    <div className="w-full">
      <p className="text-lg font-semibold text-white mb-4 text-center leading-relaxed">{question}</p>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          maxLength={500}
          className={cn(
            'w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4',
            'text-white placeholder-white/40 text-base leading-relaxed',
            'focus:outline-none focus:ring-2 focus:ring-ramadan-gold/50 focus:border-ramadan-gold/50',
            'transition-all duration-300 resize-none'
          )}
        />
        <span className="absolute bottom-3 right-4 text-white/30 text-xs">
          {value.length}/500
        </span>
      </div>
    </div>
  )
}
