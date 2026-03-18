'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface CharacterShowcaseProps {
  images: string[]
  interval?: number
}

export function CharacterShowcase({ images, interval = 3000 }: CharacterShowcaseProps) {
  const [centerIndex, setCenterIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [images.length, interval])

  const getVisibleCharacters = () => {
    const total = images.length
    const positions = []
    for (let offset = -2; offset <= 2; offset++) {
      const idx = ((centerIndex + offset) % total + total) % total
      positions.push({ index: idx, offset })
    }
    return positions
  }

  const characters = getVisibleCharacters()

  return (
    <div className="relative w-full flex-1 min-h-[200px] flex items-end justify-center overflow-hidden">
      {characters.map(({ index, offset }) => {
        const absOffset = Math.abs(offset)
        const isFocused = offset === 0

        return (
          <div
            key={`${index}-${offset}`}
            className="absolute bottom-0 transition-all duration-700 ease-out"
            style={{
              transform: `translateX(${offset * 130}px) scale(${isFocused ? 1 : absOffset === 1 ? 0.78 : 0.58})`,
              zIndex: 10 - absOffset,
              filter: isFocused ? 'none' : `blur(${absOffset * 2.5}px)`,
              opacity: isFocused ? 1 : absOffset === 1 ? 0.55 : 0.2,
            }}
          >
            <div className={cn(
              'relative w-[220px] h-[320px] md:w-[280px] md:h-[400px]',
              isFocused && 'drop-shadow-[0_0_40px_rgba(201,168,76,0.25)]'
            )}>
              <Image
                src={images[index]}
                alt={`Fawazeer character ${index + 1}`}
                fill
                className="object-contain object-bottom"
                sizes="280px"
              />
            </div>
          </div>
        )
      })}

      {/* Subtle glow under focused character */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-12 bg-ramadan-gold/8 blur-3xl rounded-full" />
    </div>
  )
}
