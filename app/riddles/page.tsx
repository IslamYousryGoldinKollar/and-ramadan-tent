'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EpisodeCard } from '@/components/riddles/episode-card'
import { Card, CardContent } from '@/components/ui/card'
import { Brain, ArrowLeft } from 'lucide-react'
import { EandLogo } from '@/components/ui/eand-logo'

interface Episode {
  id: string
  title: string
  description?: string
  episodeNumber: number
  isActive: boolean
  createdAt: string
}

export default function RiddlesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEpisodes()
  }, [])

  const fetchEpisodes = async () => {
    try {
      const response = await fetch('/api/riddles')
      if (response.ok) {
        const data = await response.json()
        setEpisodes(data)
      }
    } catch (error) {
      console.error('Error fetching episodes:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ramadan-subtle flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-eand-ocean/95 backdrop-blur-md border-b border-white/10 safe-top">
        <div className="content-container py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/70 active:text-ramadan-gold">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Home</span>
          </Link>
          <EandLogo size="sm" className="brightness-0 invert" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6 lg:py-10">
        <div className="content-container">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-eand-ocean/10 rounded-2xl flex items-center justify-center mx-auto mb-3 opacity-0 animate-scale-in">
              <Brain className="h-7 w-7 text-eand-ocean" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 opacity-0 animate-fade-in-up delay-200">
              Ramadan Riddles
            </h1>
            <p className="text-sm text-eand-grey opacity-0 animate-fade-in-up delay-300">
              Watch episodes, answer questions & win prizes
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eand-ocean"></div>
            </div>
          ) : episodes.length === 0 ? (
            <Card className="opacity-0 animate-fade-in-up delay-400">
              <CardContent className="py-12 text-center">
                <Brain className="h-10 w-10 text-eand-light-grey mx-auto mb-3" />
                <p className="text-eand-grey text-sm">No episodes available yet</p>
                <p className="text-xs text-eand-med-grey mt-1">
                  Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
              {episodes.map((episode, index) => (
                <div key={episode.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${300 + index * 100}ms` }}>
                  <EpisodeCard {...episode} createdAt={new Date(episode.createdAt)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
