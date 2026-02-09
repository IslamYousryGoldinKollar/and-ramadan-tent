'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { Lightbulb, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface DailyTip {
  id: string
  title: string
  shortTip: string
  fullContent: string
  tipNumber: number
  isActive: boolean
}

export default function AdminDailyTipsPage() {
  const [tips, setTips] = useState<DailyTip[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingTip, setEditingTip] = useState<DailyTip | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [shortTip, setShortTip] = useState('')
  const [fullContent, setFullContent] = useState('')
  const [tipNumber, setTipNumber] = useState(1)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchTips() }, [])

  const fetchTips = async () => {
    try {
      const res = await fetch('/api/daily-tips?admin=true')
      if (res.ok) setTips(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditingTip(null)
    setTitle('')
    setShortTip('')
    setFullContent('')
    setTipNumber(tips.length + 1)
    setShowDialog(true)
  }

  const openEdit = (tip: DailyTip) => {
    setEditingTip(tip)
    setTitle(tip.title)
    setShortTip(tip.shortTip)
    setFullContent(tip.fullContent)
    setTipNumber(tip.tipNumber)
    setShowDialog(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { title, shortTip, fullContent, tipNumber }
      const url = editingTip ? `/api/daily-tips/${editingTip.id}` : '/api/daily-tips'
      const method = editingTip ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setShowDialog(false)
        fetchTips()
      }
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleToggle = async (id: string) => {
    await fetch(`/api/daily-tips/${id}`, { method: 'PATCH' })
    fetchTips()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`/api/daily-tips/${deleteId}`, { method: 'DELETE' })
    setDeleteId(null)
    fetchTips()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Lightbulb className="h-8 w-8" />
              Daily Tips
            </h1>
            <p className="text-gray-600 mt-2">Manage daily Ramadan tips</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tip
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="pt-4 pb-4"><p className="text-2xl font-bold">{tips.length}</p><p className="text-xs text-gray-500">Total Tips</p></CardContent></Card>
          <Card><CardContent className="pt-4 pb-4"><p className="text-2xl font-bold text-green-600">{tips.filter(t => t.isActive).length}</p><p className="text-xs text-gray-500">Active</p></CardContent></Card>
          <Card><CardContent className="pt-4 pb-4"><p className="text-2xl font-bold text-gray-400">{tips.filter(t => !t.isActive).length}</p><p className="text-xs text-gray-500">Inactive</p></CardContent></Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eand-red" />
          </div>
        ) : tips.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No daily tips yet.</div>
        ) : (
          <div className="space-y-3">
            {tips.map((tip) => (
              <Card key={tip.id} className={`modern-card-hover group ${!tip.isActive ? 'opacity-60' : ''}`}>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold text-sm shrink-0">
                    {tip.tipNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{tip.title}</h3>
                      {tip.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="outline">Inactive</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">{tip.shortTip}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(tip)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleToggle(tip.id)}>
                      {tip.isActive ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(tip.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTip ? 'Edit Tip' : 'Add Daily Tip'}</DialogTitle>
            <DialogDescription>Fill in the tip details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tip title" />
              </div>
              <div className="space-y-2">
                <Label>Tip #</Label>
                <Input type="number" min="1" value={tipNumber} onChange={(e) => setTipNumber(parseInt(e.target.value) || 1)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Short Tip</Label>
              <Input value={shortTip} onChange={(e) => setShortTip(e.target.value)} placeholder="Brief tip text" />
            </div>
            <div className="space-y-2">
              <Label>Full Content</Label>
              <textarea
                value={fullContent}
                onChange={(e) => setFullContent(e.target.value)}
                placeholder="Detailed tip content..."
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} className="flex-1" disabled={!title || !shortTip || !fullContent || saving}>
                {saving ? 'Saving...' : editingTip ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Tip"
        description="This will permanently delete this daily tip."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  )
}
