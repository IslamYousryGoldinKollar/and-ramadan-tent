'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RefreshCw, Trash2, AlertTriangle, ArrowLeft, Copy } from 'lucide-react'
import Link from 'next/link'

interface DuplicateReservation {
  id: string
  serialNumber: string
  employeeName: string | null
  employeeId: string | null
  email: string | null
  phoneNumber: string | null
  seatCount: number
  status: string
  reservationDate: string
  createdAt: string
}

interface DuplicateGroup {
  key: string
  matchType: 'email' | 'employeeId'
  matchValue: string
  date: string
  reservations: DuplicateReservation[]
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  CANCELLED: 'bg-red-100 text-red-700',
  RESCHEDULED: 'bg-blue-100 text-blue-700',
  CHECKED_IN: 'bg-purple-100 text-purple-700',
}

export default function AdminDuplicatesPage() {
  const [groups, setGroups] = useState<DuplicateGroup[]>([])
  const [totalDuplicates, setTotalDuplicates] = useState(0)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Selection: track which reservation IDs are selected for deletion
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const fetchDuplicates = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reservations/duplicates')
      if (res.ok) {
        const data = await res.json()
        setGroups(data.groups)
        setTotalDuplicates(data.totalDuplicateReservations)
      }
    } catch (err) {
      console.error('Error fetching duplicates:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDuplicates()
  }, [])

  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 5000)
      return () => clearTimeout(t)
    }
  }, [feedback])

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  // Auto-select all duplicates in a group (keep the earliest created one)
  const autoSelectGroup = (group: DuplicateGroup) => {
    const sorted = [...group.reservations].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    const next = new Set(selected)
    // Keep the first (earliest), select the rest for deletion
    sorted.slice(1).forEach((r) => next.add(r.id))
    setSelected(next)
  }

  const autoSelectAllDuplicates = () => {
    const next = new Set(selected)
    for (const group of groups) {
      const sorted = [...group.reservations].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      sorted.slice(1).forEach((r) => next.add(r.id))
    }
    setSelected(next)
  }

  const handleDeleteSelected = async () => {
    if (selected.size === 0) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/reservations/duplicates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) }),
      })
      if (res.ok) {
        const data = await res.json()
        setFeedback({ type: 'success', msg: `Removed ${data.deleted} duplicate reservation(s) — no notifications sent` })
        setSelected(new Set())
        fetchDuplicates()
      } else {
        setFeedback({ type: 'error', msg: 'Failed to delete duplicates' })
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Failed to delete duplicates' })
    }
    setActionLoading(false)
    setShowDeleteDialog(false)
  }

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/reservations">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Duplicate Reservations</h1>
            <p className="text-sm text-gray-500">
              {groups.length} duplicate group(s) found — {totalDuplicates} extra reservation(s)
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {groups.length > 0 && (
            <Button variant="outline" size="sm" onClick={autoSelectAllDuplicates}>
              <Copy className="h-4 w-4 mr-1" /> Auto-Select All Duplicates
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={fetchDuplicates} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {feedback.msg}
        </div>
      )}

      {/* Bulk delete bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg flex-wrap">
          <span className="text-sm font-medium text-red-700">
            {selected.size} reservation(s) selected for removal
          </span>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-3 w-3 mr-1" /> Remove Selected
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            Clear Selection
          </Button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Card className="modern-card">
          <CardContent className="p-12 text-center text-gray-400">Loading...</CardContent>
        </Card>
      ) : groups.length === 0 ? (
        <Card className="modern-card">
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-lg font-semibold text-gray-700">No duplicates found</p>
            <p className="text-sm text-gray-400 mt-1">All reservations are unique per email/employee ID per day.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.key} className="modern-card overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-base">
                      <Badge variant="outline" className="mr-2 text-xs">
                        {group.matchType === 'email' ? 'Email' : 'Employee ID'}
                      </Badge>
                      <span className="font-mono text-sm">{group.matchValue}</span>
                    </CardTitle>
                    <p className="text-xs text-gray-400 mt-1">
                      Date: {new Date(group.date).toLocaleDateString()} — {group.reservations.length} reservations
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => autoSelectGroup(group)}
                    className="text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" /> Auto-Select Duplicates
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="p-2 text-left w-8">
                          <span className="text-[10px] text-gray-400">Del?</span>
                        </th>
                        <th className="p-2 text-left text-xs">Serial</th>
                        <th className="p-2 text-left text-xs">Name</th>
                        <th className="p-2 text-left text-xs">Employee ID</th>
                        <th className="p-2 text-left text-xs">Email</th>
                        <th className="p-2 text-center text-xs">Seats</th>
                        <th className="p-2 text-left text-xs">Status</th>
                        <th className="p-2 text-left text-xs">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...group.reservations]
                        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                        .map((r, idx) => (
                          <tr
                            key={r.id}
                            className={`border-b border-gray-50 transition-colors ${
                              selected.has(r.id) ? 'bg-red-50/60' : idx === 0 ? 'bg-green-50/30' : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="p-2">
                              <input
                                type="checkbox"
                                checked={selected.has(r.id)}
                                onChange={() => toggleSelect(r.id)}
                                className="rounded"
                              />
                            </td>
                            <td className="p-2 font-mono text-xs font-semibold">
                              {r.serialNumber}
                              {idx === 0 && (
                                <span className="ml-1 text-[9px] text-green-600 font-normal">(earliest)</span>
                              )}
                            </td>
                            <td className="p-2">{r.employeeName || '—'}</td>
                            <td className="p-2 text-gray-500">{r.employeeId || '—'}</td>
                            <td className="p-2 text-gray-500 truncate max-w-[180px]">{r.email || '—'}</td>
                            <td className="p-2 text-center font-semibold">{r.seatCount}</td>
                            <td className="p-2">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-600'}`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="p-2 text-gray-400 text-xs whitespace-nowrap">
                              {new Date(r.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <div className="flex justify-center mb-2"><AlertTriangle className="h-10 w-10 text-red-500" /></div>
            <DialogTitle className="text-center">Remove {selected.size} Duplicate(s)?</DialogTitle>
            <DialogDescription className="text-center">
              These reservations will be permanently deleted. <strong>No email notifications</strong> will be sent to users.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSelected} disabled={actionLoading} className="flex-1">
              {actionLoading ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
