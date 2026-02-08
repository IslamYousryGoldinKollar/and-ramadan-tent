'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, Calendar } from 'lucide-react'

interface EpisodeCardProps {
  id: string
  title: string
  description?: string
  episodeNumber: number
  isActive: boolean
  createdAt: Date
}

export function EpisodeCard({
  id,
  title,
  description,
  episodeNumber,
  isActive,
  createdAt,
}: EpisodeCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 border border-gray-100 rounded-2xl overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Episode {episodeNumber}</Badge>
              {isActive ? (
                <Badge variant="success" className="animate-fade-in">Active</Badge>
              ) : (
                <Badge variant="outline">Inactive</Badge>
              )}
            </div>
            <CardTitle className="text-xl group-hover:text-eand-ocean transition-colors duration-300">{title}</CardTitle>
          </div>
        </div>
        {description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <Calendar className="h-3 w-3" />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/riddles/${id}`}>
          <Button className="w-full group-hover:shadow-md transition-all duration-300" disabled={!isActive}>
            <PlayCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            {isActive ? 'Watch & Answer' : 'Coming Soon'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
