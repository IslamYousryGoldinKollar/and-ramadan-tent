'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AutoSlideHeroProps {
  images: string[]
  interval?: number
  overlay?: string
  children: React.ReactNode
}

export function AutoSlideHero({ images, interval = 4000, overlay, children }: AutoSlideHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className="relative w-full min-h-full flex flex-col">
      {/* Sliding background images */}
      {images.map((src, index) => (
        <div
          key={src}
          className={cn(
            'absolute inset-0 transition-all duration-[1500ms] ease-in-out',
            index === currentIndex
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          )}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Dark overlay for readability */}
      <div className={cn(
        'absolute inset-0',
        overlay || 'bg-gradient-to-b from-eand-ocean/85 via-eand-ocean/75 to-eand-ocean/90'
      )} />

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1 rounded-full transition-all duration-700',
              index === currentIndex
                ? 'w-5 bg-white/60'
                : 'w-1.5 bg-white/20'
            )}
          />
        ))}
      </div>

      {/* Content on top */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}
