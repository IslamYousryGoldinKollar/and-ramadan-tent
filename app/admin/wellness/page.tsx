'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Lightbulb, Plus, Edit, Trash2 } from 'lucide-react'

interface WellnessContent {
  id: string
  title: string
  content: string
  pdfUrl?: string | null
  displayOrder: number
  isActive: boolean
}

export default function AdminWellnessPage() {
  const [content, setContent] = useState<WellnessContent[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingContent, setEditingContent] = useState<WellnessContent | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [contentText, setContentText] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/wellness?admin=true')
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      }
    } catch (error) {
      console.error('Error fetching wellness content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: contentText,
          pdfUrl: pdfUrl || undefined,
          displayOrder,
        }),
      })

      if (response.ok) {
        setShowCreateDialog(false)
        resetForm()
        fetchContent()
      }
    } catch (error) {
      console.error('Error creating content:', error)
    }
  }

  const handleUpdate = async () => {
    if (!editingContent) return

    try {
      const response = await fetch(`/api/wellness/${editingContent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: contentText,
          pdfUrl: pdfUrl || undefined,
          displayOrder,
        }),
      })

      if (response.ok) {
        setEditingContent(null)
        resetForm()
        fetchContent()
      }
    } catch (error) {
      console.error('Error updating content:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      const response = await fetch(`/api/wellness/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchContent()
      }
    } catch (error) {
      console.error('Error deleting content:', error)
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/wellness/${id}`, {
        method: 'PATCH',
      })

      if (response.ok) {
        fetchContent()
      }
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  const resetForm = () => {
    setTitle('')
    setContentText('')
    setPdfUrl('')
    setDisplayOrder(0)
  }

  const openEditDialog = (item: WellnessContent) => {
    setEditingContent(item)
    setTitle(item.title)
    setContentText(item.content)
    setPdfUrl(item.pdfUrl || '')
    setDisplayOrder(item.displayOrder)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Lightbulb className="h-8 w-8" />
              Ramadan Tips Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage Ramadan tips and health advice
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eand-red"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {content.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{item.title}</CardTitle>
                        {item.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                        <Badge variant="secondary">Order: {item.displayOrder}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(item.id)}
                      >
                        {item.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line line-clamp-3">{item.content}</p>
                  {item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-eand-red hover:underline mt-2 inline-block"
                    >
                      View PDF →
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog
        open={showCreateDialog || editingContent !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false)
            setEditingContent(null)
            resetForm()
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingContent ? 'Edit Content' : 'Create New Content'}
            </DialogTitle>
            <DialogDescription>
              Add or edit Ramadan tips for employees
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Content title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Enter tip content..."
                className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdfUrl">PDF URL (optional)</Label>
              <Input
                id="pdfUrl"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://example.com/file.pdf"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false)
                  setEditingContent(null)
                  resetForm()
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={editingContent ? handleUpdate : handleCreate}
                className="flex-1"
              >
                {editingContent ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
