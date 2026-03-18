'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageCarouselProps {
  images: { src: string; alt: string }[]
  onSelect?: (index: number) => void
  selectedIndex?: number
  selectable?: boolean
}

export function ImageCarousel({ images, onSelect, selectedIndex, selectable = false }: ImageCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.clientWidth * 0.75
    el.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' })
  }

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.clientWidth * 0.75
    const newIndex = Math.round(el.scrollLeft / cardWidth)
    setActiveIndex(Math.min(newIndex, images.length - 1))
  }

  return (
    <div className="relative w-full">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => {
              if (selectable && onSelect) onSelect(index)
            }}
            className={cn(
              'relative flex-shrink-0 w-[72%] md:w-[45%] aspect-[4/3] rounded-2xl overflow-hidden snap-center transition-all duration-500',
              selectable && 'cursor-pointer',
              selectedIndex === index
                ? 'ring-4 ring-ramadan-gold shadow-xl shadow-ramadan-gold/30 scale-[1.02]'
                : 'ring-1 ring-white/10',
              activeIndex === index ? 'opacity-100' : 'opacity-70'
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
              sizes="(max-width: 768px) 75vw, 45vw"
            />
            {selectedIndex === index && (
              <div className="absolute inset-0 bg-ramadan-gold/20 flex items-center justify-center">
                <div className="bg-ramadan-gold text-eand-ocean rounded-full p-2 shadow-lg animate-scale-in">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
            {selectable && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-sm font-medium text-center">{image.alt}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows (desktop) */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white hover:bg-white/30 transition-all shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white hover:bg-white/30 transition-all shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {images.map((_, index) => (
          <div
            key={index}
            className={cn(
              'rounded-full transition-all duration-300',
              activeIndex === index
                ? 'w-6 h-2 bg-ramadan-gold'
                : 'w-2 h-2 bg-white/30'
            )}
          />
        ))}
      </div>
    </div>
  )
}
