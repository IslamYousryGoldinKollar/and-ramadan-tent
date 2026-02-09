'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { FileUploader } from '@/components/admin/file-uploader'
import { getVideoPlatform } from '@/components/riddles/video-embed'
import { Brain, Plus, Edit, Trophy, Trash2, ToggleLeft, ToggleRight, Video, Search, Youtube } from 'lucide-react'
import Link from 'next/link'

interface Episode {
  id: string
  title: string
  description?: string
  videoUrl: string
  episodeNumber: number
  isActive: boolean
  createdAt: string
  questions: Array<{ id: string }>
  _count?: { answers: number }
}

export default function AdminRiddlesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [episodeNumber, setEpisodeNumber] = useState(1)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchEpisodes()
  }, [])

  const fetchEpisodes = async () => {
    try {
      const response = await fetch('/api/riddles?admin=true')
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

  const handleCreateEpisode = async () => {
    setCreating(true)
    try {
      const response = await fetch('/api/riddles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, videoUrl, episodeNumber }),
      })

      if (response.ok) {
        setShowCreateDialog(false)
        setTitle('')
        setDescription('')
        setVideoUrl('')
        setEpisodeNumber(episodes.length + 1)
        fetchEpisodes()
      }
    } catch (error) {
      console.error('Error creating episode:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await fetch(`/api/riddles/${id}`, { method: 'PATCH' })
      fetchEpisodes()
    } catch (error) {
      console.error('Error toggling episode:', error)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`/api/riddles/${deleteId}`, { method: 'DELETE' })
      setDeleteId(null)
      fetchEpisodes()
    } catch (error) {
      console.error('Error deleting episode:', error)
    }
  }

  const getPlatformIcon = (url: string) => {
    const platform = getVideoPlatform(url)
    switch (platform) {
      case 'youtube': return <Youtube className="h-3.5 w-3.5 text-red-600" />
      case 'vimeo': return <Video className="h-3.5 w-3.5 text-blue-500" />
      default: return <Video className="h-3.5 w-3.5 text-gray-500" />
    }
  }

  const filtered = episodes.filter((e) =>
    !search || e.title.toLowerCase().includes(search.toLowerCase())
  )

  const totalAnswers = episodes.reduce((sum, e) => sum + (e._count?.answers || 0), 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="h-8 w-8" />
              Riddles Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage riddle episodes, questions, and raffles
            </p>
          </div>
          <Button onClick={() => { setEpisodeNumber(episodes.length + 1); setShowCreateDialog(true) }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Episode
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{episodes.length}</p>
              <p className="text-xs text-gray-500">Total Episodes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold text-green-600">{episodes.filter((e) => e.isActive).length}</p>
              <p className="text-xs text-gray-500">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{episodes.reduce((sum, e) => sum + e.questions.length, 0)}</p>
              <p className="text-xs text-gray-500">Total Questions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold text-eand-red">{totalAnswers}</p>
              <p className="text-xs text-gray-500">Total Answers</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search episodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Episodes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eand-red"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {search ? 'No episodes match your search.' : 'No episodes yet. Create your first one!'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((episode) => (
              <Card key={episode.id} className={`modern-card-hover group ${!episode.isActive ? 'opacity-75' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Ep. {episode.episodeNumber}</Badge>
                        {episode.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                        <span className="flex items-center">{getPlatformIcon(episode.videoUrl)}</span>
                      </div>
                      <CardTitle className="text-lg">{episode.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {episode.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{episode.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{episode.questions.length} questions</span>
                    <span>{episode._count?.answers || 0} answers</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/riddles/${episode.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(episode.id)}
                      title={episode.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {episode.isActive ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(episode.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Episode Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Episode</DialogTitle>
            <DialogDescription>
              Add a new riddle episode with a video from YouTube, Vimeo, Canva, or upload
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Episode title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Episode description (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="YouTube, Vimeo, Canva, or MP4 URL"
              />
              <p className="text-xs text-gray-500">Or upload a video below:</p>
              <FileUploader
                accept="video/*"
                label="Upload Video"
                onUpload={(url) => setVideoUrl(url)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="episodeNumber">Episode Number</Label>
              <Input
                id="episodeNumber"
                type="number"
                min="1"
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCreateEpisode} className="flex-1" disabled={!title || !videoUrl || creating}>
                {creating ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Episode"
        description="This will permanently delete this episode and all its questions, answers, and raffle data. This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  )
}
