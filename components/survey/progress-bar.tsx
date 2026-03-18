'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  sectionLabels: string[]
}

const sectionColors = [
  'bg-purple-500',
  'bg-amber-500',
  'bg-blue-500',
  'bg-red-500',
  'bg-emerald-500',
]

const sectionEmojis = ['🟣', '🟡', '🔵', '🔴', '🟢']

export function ProgressBar({ currentStep, totalSteps, sectionLabels }: ProgressBarProps) {
  const progress = ((currentStep) / totalSteps) * 100

  return (
    <div className="w-full px-4">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/60 text-xs font-medium">
          {sectionEmojis[currentStep] || '✨'} Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-ramadan-gold text-xs font-bold">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-ramadan-gold via-amber-400 to-ramadan-gold"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-ramadan-gold via-amber-400 to-ramadan-gold opacity-50 blur-sm"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Section dots */}
      <div className="flex justify-between mt-3">
        {sectionLabels.map((label, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-500 border-2',
                index < currentStep
                  ? 'bg-ramadan-gold border-ramadan-gold scale-100'
                  : index === currentStep
                  ? cn(sectionColors[index], 'border-white scale-125 shadow-lg')
                  : 'bg-white/10 border-white/20 scale-100'
              )}
            />
            <span
              className={cn(
                'text-[9px] font-medium transition-colors duration-300 hidden md:block',
                index === currentStep ? 'text-white' : 'text-white/30'
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
