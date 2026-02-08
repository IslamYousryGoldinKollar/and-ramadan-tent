'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { FileText, Plus, Edit, Trash2, ToggleLeft, ToggleRight, Search, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = ['Health', 'Nutrition', 'Spiritual', 'Lifestyle', 'Fitness', 'General']

const CATEGORY_COLORS: Record<string, string> = {
  Health: 'bg-green-100 text-green-800',
  Nutrition: 'bg-orange-100 text-orange-800',
  Spiritual: 'bg-purple-100 text-purple-800',
  Lifestyle: 'bg-blue-100 text-blue-800',
  Fitness: 'bg-red-100 text-red-800',
  General: 'bg-gray-100 text-gray-800',
}

interface Article {
  id: string
  title: string
  excerpt?: string
  category: string
  imageUrl?: string
  videoUrl?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  useEffect(() => { fetchArticles() }, [])

  const fetchArticles = async () => {
    try {
      let url = '/api/ramadan-articles?admin=true'
      if (filterCategory) url += `&category=${filterCategory}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      const res = await fetch(url)
      if (res.ok) setArticles(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchArticles() }, [filterCategory])

  const handleToggle = async (id: string) => {
    await fetch(`/api/ramadan-articles/${id}`, { method: 'PATCH' })
    fetchArticles()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`/api/ramadan-articles/${deleteId}`, { method: 'DELETE' })
    setDeleteId(null)
    fetchArticles()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchArticles()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8" />
              Ramadan Articles
            </h1>
            <p className="text-gray-600 mt-2">Manage rich-content articles with categories</p>
          </div>
          <Link href="/admin/tips/articles/new/edit">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-4 pb-4"><p className="text-2xl font-bold">{articles.length}</p><p className="text-xs text-gray-500">Total Articles</p></CardContent></Card>
          <Card><CardContent className="pt-4 pb-4"><p className="text-2xl font-bold text-green-600">{articles.filter(a => a.isActive).length}</p><p className="text-xs text-gray-500">Published</p></CardContent></Card>
          <Card><CardContent className="pt-4 pb-4"><p className="text-2xl font-bold text-gray-400">{articles.filter(a => !a.isActive).length}</p><p className="text-xs text-gray-500">Drafts</p></CardContent></Card>
          <Card><CardContent className="pt-4 pb-4"><p className="text-2xl font-bold">{new Set(articles.map(a => a.category)).size}</p><p className="text-xs text-gray-500">Categories Used</p></CardContent></Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </form>
          <div className="flex gap-1 flex-wrap">
            <Button
              variant={filterCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCategory('')}
            >
              All
            </Button>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={filterCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eand-red" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No articles found.</div>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <Card key={article.id} className={!article.isActive ? 'opacity-60' : ''}>
                <CardContent className="flex items-center gap-4 py-4">
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{article.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[article.category] || CATEGORY_COLORS.General}`}>
                        {article.category}
                      </span>
                      {article.isActive ? <Badge variant="success">Published</Badge> : <Badge variant="outline">Draft</Badge>}
                    </div>
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 truncate">{article.excerpt}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Order: {article.displayOrder}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/admin/tips/articles/${article.id}/edit`}>
                      <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleToggle(article.id)}>
                      {article.isActive ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(article.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Article"
        description="This will permanently delete this article."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  )
}
