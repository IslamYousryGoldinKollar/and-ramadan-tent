'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileUploader } from '@/components/admin/file-uploader'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

const RichTextEditor = dynamic(
  () => import('@/components/admin/rich-text-editor').then((m) => m.RichTextEditor),
  { ssr: false, loading: () => <div className="h-[300px] border rounded-lg animate-pulse bg-gray-50" /> }
)

const CATEGORIES = ['Health', 'Nutrition', 'Spiritual', 'Lifestyle', 'Fitness', 'General']

export default function ArticleEditorPage() {
  const params = useParams()
  const router = useRouter()
  const isNew = params.id === 'new'

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [htmlContent, setHtmlContent] = useState('')
  const [category, setCategory] = useState('General')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/ramadan-articles/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title || '')
          setExcerpt(data.excerpt || '')
          setHtmlContent(data.htmlContent || '')
          setCategory(data.category || 'General')
          setImageUrl(data.imageUrl || '')
          setVideoUrl(data.videoUrl || '')
          setDisplayOrder(data.displayOrder || 0)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [isNew, params.id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { title, excerpt, htmlContent, category, imageUrl: imageUrl || null, videoUrl: videoUrl || null, displayOrder }
      const url = isNew ? '/api/ramadan-articles' : `/api/ramadan-articles/${params.id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        router.push('/admin/tips/articles')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eand-red" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/tips/articles">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <h1 className="text-2xl font-bold">{isNew ? 'New Article' : 'Edit Article'}</h1>
          </div>
          <Button onClick={handleSave} disabled={!title || !htmlContent || saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title" />
                </div>
                <div className="space-y-2">
                  <Label>Excerpt</Label>
                  <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary (optional)" />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <RichTextEditor content={htmlContent} onChange={setHtmlContent} placeholder="Write your article content here..." />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input type="number" min="0" value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (optional)" />
                  <FileUploader accept="image/*" label="Upload Image" onUpload={(url) => setImageUrl(url)} />
                  {imageUrl && (
                    <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Video</Label>
                  <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Video URL (optional)" />
                  <FileUploader accept="video/*" label="Upload Video" onUpload={(url) => setVideoUrl(url)} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
