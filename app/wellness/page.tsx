'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { WellnessContentCard } from '@/components/wellness/content-card'
import { Lightbulb, ArrowLeft, Heart, Moon, Droplets, Apple, Sparkles, BookOpen, ChevronDown, Star } from 'lucide-react'
import { EandLogo } from '@/components/ui/eand-logo'

interface WellnessContent {
  id: string
  title: string
  excerpt?: string | null
  htmlContent: string
  category: string
  imageUrl?: string | null
  videoUrl?: string | null
  displayOrder: number
}

interface DailyTip {
  id: string
  title: string
  shortTip: string
  fullContent: string
  tipNumber: number
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

type Tab = 'daily' | 'articles'

export default function WellnessPage() {
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([])
  const [articles, setArticles] = useState<WellnessContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('daily')

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setError(false)
    setLoading(true)
    try {
      const [tipsRes, articlesRes] = await Promise.all([
        fetch('/api/daily-tips'),
        fetch('/api/ramadan-articles'),
      ])
      if (tipsRes.ok) setDailyTips(await tipsRes.json())
      if (articlesRes.ok) setArticles(await articlesRes.json())
    } catch (err) {
      console.error('Error fetching content:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const totalCount = dailyTips.length + articles.length

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
      <section className="relative overflow-hidden bg-ramadan-dark px-4 pt-10 pb-6 lg:pt-16 lg:pb-10">
        <div className="absolute top-6 right-8 text-eand-bright-green/10 animate-float-slow">
          <Moon className="h-32 w-32 lg:h-48 lg:w-48" />
        </div>
        <div className="particle w-1.5 h-1.5 bg-eand-bright-green/20 top-1/4 left-[20%] animate-twinkle" />
        <div className="particle w-1 h-1 bg-white/15 bottom-1/4 right-[25%] animate-twinkle delay-1000" />

        <div className="content-container text-center relative z-10">
          <div className="w-20 h-20 bg-eand-dark-green/30 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-5 border border-eand-bright-green/20 opacity-0 animate-scale-in">
            <Lightbulb className="h-10 w-10 text-eand-bright-green" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight opacity-0 animate-fade-in-up delay-200">
            Ramadan Tips
          </h1>
          <p className="text-base text-white/60 leading-relaxed max-w-xs mx-auto opacity-0 animate-fade-in-up delay-400">
            {totalCount > 0 ? `${totalCount} tips & articles for a healthier Ramadan` : 'Health advice & tips for a better Ramadan'}
          </p>
        </div>
      </section>

      {/* Tabs */}
      {!loading && !error && totalCount > 0 && (
        <div className="sticky top-[52px] z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="content-container flex">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 py-3 text-sm font-semibold text-center transition-colors duration-300 relative ${
                activeTab === 'daily' ? 'text-eand-ocean' : 'text-gray-400'
              }`}
            >
              <Star className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
              Daily Tips ({dailyTips.length})
              {activeTab === 'daily' && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-eand-ocean rounded-full animate-scale-in" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex-1 py-3 text-sm font-semibold text-center transition-colors duration-300 relative ${
                activeTab === 'articles' ? 'text-eand-ocean' : 'text-gray-400'
              }`}
            >
              <BookOpen className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
              Articles ({articles.length})
              {activeTab === 'articles' && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-eand-ocean rounded-full animate-scale-in" />
              )}
            </button>
          </div>
        </div>
      )}

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
                onClick={fetchAll}
                className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
              >
                Tap to retry
              </button>
            </div>
          ) : totalCount === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Moon className="h-8 w-8 text-amber-300" />
              </div>
              <p className="text-gray-700 font-medium mb-1">Tips coming soon!</p>
              <p className="text-sm text-gray-400">
                Ramadan tips will be shared throughout the month. Check back soon!
              </p>
            </div>
          ) : activeTab === 'daily' ? (
            /* Daily Tips Tab */
            <div className="space-y-3">
              {dailyTips.map((tip, index) => {
                const isOpen = expandedId === tip.id
                return (
                  <div key={tip.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden opacity-0 animate-fade-in-up hover:shadow-md transition-shadow duration-300" style={{ animationDelay: `${100 + index * 80}ms` }}>
                    <button
                      onClick={() => setExpandedId(isOpen ? null : tip.id)}
                      className="w-full text-left p-4 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-eand-ocean to-ramadan-deep rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-bold text-sm">{tip.tipNumber}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug">{tip.title}</h3>
                        {!isOpen && (
                          <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{tip.shortTip}</p>
                        )}
                      </div>
                      <ChevronDown className={`h-5 w-5 text-gray-300 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-4 pb-4 pt-0">
                        <div className="border-t border-gray-100 pt-3">
                          <p className="text-sm font-medium text-eand-ocean mb-2">{tip.shortTip}</p>
                          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{tip.fullContent}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Articles Tab */
            <div className="space-y-3">
              {articles.map((item, index) => (
                <div key={item.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${100 + index * 80}ms` }}>
                  <WellnessContentCard
                    {...item}
                    icon={tipIcons[index % tipIcons.length]}
                    colorClass={tipColors[index % tipColors.length]}
                    isExpanded={expandedId === item.id}
                    onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  />
                </div>
              ))}
            </div>
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
