'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  sectionLabels: string[]
}

export function ProgressBar({ currentStep, totalSteps, sectionLabels }: ProgressBarProps) {
  const progress = ((currentStep) / totalSteps) * 100

  return (
    <div className="w-full">
      {/* Thin segmented bar */}
      <div className="flex items-center gap-[3px]">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-[3px] flex-1 rounded-full transition-all duration-500',
              i < currentStep
                ? 'bg-ramadan-gold'
                : i === currentStep
                ? 'bg-ramadan-gold/60'
                : 'bg-white/[0.08]'
            )}
          />
        ))}
      </div>

      {/* Minimal label */}
      <div className="flex items-center justify-between mt-2 px-0.5">
        <span className="text-white/40 text-[11px]">
          {sectionLabels[currentStep]}
        </span>
        <span className="text-white/30 text-[11px]">
          {currentStep + 1}/{totalSteps}
        </span>
      </div>
    </div>
  )
}
