'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { WellnessContentCard } from '@/components/wellness/content-card'
import { Lightbulb, ArrowLeft, Heart, Moon, Droplets, Apple, Sparkles } from 'lucide-react'
import { EandLogo } from '@/components/ui/eand-logo'

interface WellnessContent {
  id: string
  title: string
  content: string
  pdfUrl?: string | null
  displayOrder: number
}

const tipIcons = [Lightbulb, Heart, Moon, Droplets, Apple, Sparkles]
const tipColors = [
  { bg: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-200' },
  { bg: 'from-rose-400 to-pink-500', shadow: 'shadow-rose-200' },
  { bg: 'from-indigo-400 to-purple-500', shadow: 'shadow-indigo-200' },
  { bg: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-200' },
  { bg: 'from-emerald-400 to-green-500', shadow: 'shadow-emerald-200' },
  { bg: 'from-fuchsia-400 to-violet-500', shadow: 'shadow-fuchsia-200' },
]

export default function WellnessPage() {
  const [content, setContent] = useState<WellnessContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/wellness')
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      } else {
        setError(true)
      }
    } catch (err) {
      console.error('Error fetching content:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ramadan-subtle flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-eand-ocean/95 backdrop-blur-md border-b border-white/10 safe-top">
        <div className="content-container py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/70 active:text-ramadan-gold transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          <EandLogo size="sm" className="brightness-0 invert" />
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-ramadan-dark px-4 pt-10 pb-8 lg:pt-16 lg:pb-12">
        <div className="absolute top-6 right-8 text-eand-bright-green/10">
          <Moon className="h-32 w-32 lg:h-48 lg:w-48" />
        </div>

        <div className="content-container text-center relative z-10">
          <div className="w-20 h-20 bg-eand-dark-green/30 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-5 border border-eand-bright-green/20">
            <Lightbulb className="h-10 w-10 text-eand-bright-green" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Ramadan Tips
          </h1>
          <p className="text-base text-white/60 leading-relaxed max-w-xs mx-auto">
            Health advice & tips for a better, more energized Ramadan
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 px-4 py-6 lg:py-10">
        <div className="content-container">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-red-300" />
              </div>
              <p className="text-gray-700 font-medium mb-1">Unable to load tips</p>
              <p className="text-sm text-gray-400 mb-4">Please check your connection and try again</p>
              <button
                onClick={() => { setError(false); setLoading(true); fetchContent() }}
                className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
              >
                Tap to retry
              </button>
            </div>
          ) : content.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Moon className="h-8 w-8 text-amber-300" />
              </div>
              <p className="text-gray-700 font-medium mb-1">Tips coming soon!</p>
              <p className="text-sm text-gray-400">
                Ramadan tips will be shared throughout the month. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-3">
                {content.length} {content.length === 1 ? 'tip' : 'tips'} available
              </p>
              <div className="space-y-3">
                {content.map((item, index) => (
                  <WellnessContentCard
                    key={item.id}
                    {...item}
                    icon={tipIcons[index % tipIcons.length]}
                    colorClass={tipColors[index % tipColors.length]}
                    isExpanded={expandedId === item.id}
                    onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-eand-ocean px-4 py-6 text-center safe-bottom">
        <EandLogo size="sm" className="mx-auto mb-2 brightness-0 invert opacity-40" />
        <p className="text-white/30 text-xs">© 2026 e& Egypt. All rights reserved.</p>
      </footer>
    </div>
  )
}
