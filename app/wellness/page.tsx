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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 safe-top">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 text-gray-600 active:text-eand-red transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          <EandLogo size="sm" />
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 px-4 pt-10 pb-8">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-lg mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl">
            <Lightbulb className="h-10 w-10 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight drop-shadow-sm">
            Ramadan Wellness<br />Tips
          </h1>
          <p className="text-base text-white/90 leading-relaxed max-w-xs mx-auto">
            Health advice & wellness tips for a better, more energized Ramadan
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 px-4 py-6 -mt-2">
        <div className="max-w-lg mx-auto">
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
                Wellness tips will be shared throughout Ramadan. Check back soon!
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
      <footer className="px-4 py-5 text-center safe-bottom">
        <EandLogo size="sm" className="mx-auto mb-2 opacity-30" />
        <p className="text-gray-400 text-xs">© 2026 e& Egypt. All rights reserved.</p>
      </footer>
    </div>
  )
}
