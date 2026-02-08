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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 safe-top">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 text-gray-600 active:text-eand-red">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Home</span>
          </Link>
          <EandLogo size="sm" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Brain className="h-7 w-7 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Ramadan Riddles
          </h1>
          <p className="text-sm text-gray-500">
            Watch episodes, answer questions & win prizes
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : episodes.length === 0 ? (
          <Card className="border border-gray-100">
            <CardContent className="py-12 text-center">
              <Brain className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">No episodes available yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.id} {...episode} createdAt={new Date(episode.createdAt)} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
