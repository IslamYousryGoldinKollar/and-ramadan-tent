'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate, formatDateTime } from '@/lib/utils'
import {
  Search, ChevronLeft, ChevronRight, RefreshCw,
  ArrowUpDown, ArrowUp, ArrowDown, Filter, X, Download, CheckSquare, AlertTriangle
} from 'lucide-react'

interface Reservation {
  id: string
  employeeId: string | null
  employeeName: string | null
  email: string | null
  phoneNumber: string | null
  reservationDate: string
  seatCount: number
  status: string
  serialNumber: string
  createdAt: string
  user?: { fullName: string | null; department: string | null } | null
}

const STATUS_OPTIONS = ['CONFIRMED', 'PENDING', 'CANCELLED', 'RESCHEDULED', 'CHECKED_IN']
const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  CANCELLED: 'bg-red-100 text-red-700',
  RESCHEDULED: 'bg-blue-100 text-blue-700',
  CHECKED_IN: 'bg-purple-100 text-purple-700',
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Sorting
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  // Bulk action
  const [bulkStatus, setBulkStatus] = useState('')
  const [showBulkDialog, setShowBulkDialog] = useState(false)

  // Dialogs
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const fetchReservations = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '30',
        sortBy,
        sortDir,
      })
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)

      const res = await fetch(`/api/admin/reservations?${params}`)
      if (res.ok) {
        const data = await res.json()
        setReservations(data.reservations)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      console.error('Error fetching:', err)
    }
    setLoading(false)
  }, [page, search, statusFilter, dateFrom, dateTo, sortBy, sortDir])

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  // Debounced search
  const [searchInput, setSearchInput] = useState('')
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
    setPage(1)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ArrowUpDown className="h-3 w-3 opacity-30" />
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected(new Set())
    } else {
      setSelected(new Set(reservations.map(r => r.id)))
    }
    setSelectAll(!selectAll)
  }

  const handleBulkStatusChange = async () => {
    if (!bulkStatus || selected.size === 0) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected), status: bulkStatus }),
      })
      if (res.ok) {
        const data = await res.json()
        setFeedback({ type: 'success', msg: `Updated ${data.updated} reservation(s) to ${bulkStatus}` })
        setSelected(new Set())
        setSelectAll(false)
        fetchReservations()
      } else {
        setFeedback({ type: 'error', msg: 'Failed to update' })
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Failed to update' })
    }
    setActionLoading(false)
    setShowBulkDialog(false)
    setBulkStatus('')
  }

  const handleUpdateStatus = async () => {
    if (!editingReservation || !editStatus) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/reservations/${editingReservation.serialNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: editStatus }),
      })
      if (res.ok) {
        setFeedback({ type: 'success', msg: `Updated ${editingReservation.serialNumber}` })
        fetchReservations()
      } else {
        setFeedback({ type: 'error', msg: 'Failed to update status' })
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Error updating' })
    }
    setActionLoading(false)
    setShowEditDialog(false)
    setEditingReservation(null)
  }

  const exportFullCSV = async () => {
    setExportLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)

      const res = await fetch(`/api/admin/reservations/export?${params}`)
      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reservations-full-export-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      setFeedback({ type: 'success', msg: `Exported all ${total} reservation(s) to CSV` })
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Failed to export CSV' })
    }
    setExportLoading(false)
  }

  // Auto-clear feedback
  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 4000)
      return () => clearTimeout(t)
    }
  }, [feedback])

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-sm text-gray-500">{total} total reservation(s)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportFullCSV} disabled={exportLoading}>
            <Download className="h-4 w-4 mr-1" /> {exportLoading ? 'Exporting...' : 'Export All CSV'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => fetchReservations()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {feedback.msg}
        </div>
      )}

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search name, ID, email, serial..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className={showFilters ? 'bg-gray-100' : ''}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <Card className="modern-card">
            <CardContent className="p-3 flex flex-wrap gap-3 items-end">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                  className="h-9 px-3 rounded-md border border-gray-200 text-sm bg-white"
                >
                  <option value="">All</option>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">From</label>
                <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} className="h-9 w-40" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">To</label>
                <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} className="h-9 w-40" />
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setStatusFilter(''); setDateFrom(''); setDateTo(''); setPage(1) }}>
                <X className="h-3 w-3 mr-1" /> Clear
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg flex-wrap">
          <span className="text-sm font-medium text-blue-700">
            <CheckSquare className="h-4 w-4 inline mr-1" />
            {selected.size} selected
          </span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="h-8 px-2 rounded-md border border-blue-200 text-sm bg-white"
          >
            <option value="">Change status to...</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button
            size="sm"
            disabled={!bulkStatus}
            onClick={() => setShowBulkDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply to {selected.size}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setSelected(new Set()); setSelectAll(false); setBulkStatus('') }}>
            Clear Selection
          </Button>
        </div>
      )}

      {/* Table */}
      <Card className="modern-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-3 text-left w-8">
                  <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="rounded" />
                </th>
                <th className="p-3 text-left cursor-pointer select-none" onClick={() => toggleSort('serialNumber')}>
                  <span className="flex items-center gap-1">Serial <SortIcon field="serialNumber" /></span>
                </th>
                <th className="p-3 text-left cursor-pointer select-none" onClick={() => toggleSort('reservationDate')}>
                  <span className="flex items-center gap-1">Date <SortIcon field="reservationDate" /></span>
                </th>
                <th className="p-3 text-left cursor-pointer select-none" onClick={() => toggleSort('employeeName')}>
                  <span className="flex items-center gap-1">Name <SortIcon field="employeeName" /></span>
                </th>
                <th className="p-3 text-left hidden md:table-cell">Employee ID</th>
                <th className="p-3 text-left hidden lg:table-cell">Email</th>
                <th className="p-3 text-left hidden lg:table-cell">Phone</th>
                <th className="p-3 text-center cursor-pointer select-none" onClick={() => toggleSort('seatCount')}>
                  <span className="flex items-center justify-center gap-1">Seats <SortIcon field="seatCount" /></span>
                </th>
                <th className="p-3 text-left cursor-pointer select-none" onClick={() => toggleSort('status')}>
                  <span className="flex items-center gap-1">Status <SortIcon field="status" /></span>
                </th>
                <th className="p-3 text-left hidden md:table-cell cursor-pointer select-none" onClick={() => toggleSort('createdAt')}>
                  <span className="flex items-center gap-1">Created <SortIcon field="createdAt" /></span>
                </th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={11} className="p-12 text-center text-gray-400">Loading...</td></tr>
              ) : reservations.length === 0 ? (
                <tr><td colSpan={11} className="p-12 text-center text-gray-400">No reservations found</td></tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${selected.has(r.id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="p-3">
                      <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} className="rounded" />
                    </td>
                    <td className="p-3 font-mono text-xs font-semibold text-eand-red">{r.serialNumber}</td>
                    <td className="p-3 whitespace-nowrap">{new Date(r.reservationDate).toLocaleDateString()}</td>
                    <td className="p-3 font-medium">{r.employeeName || r.user?.fullName || '—'}</td>
                    <td className="p-3 hidden md:table-cell text-gray-500">{r.employeeId || '—'}</td>
                    <td className="p-3 hidden lg:table-cell text-gray-500 truncate max-w-[200px]">{r.email || '—'}</td>
                    <td className="p-3 hidden lg:table-cell text-gray-500">{r.phoneNumber || '—'}</td>
                    <td className="p-3 text-center font-semibold">{r.seatCount}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-600'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 hidden md:table-cell text-gray-400 text-xs whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setEditingReservation(r); setEditStatus(r.status); setShowEditDialog(true) }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="modern-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages} ({total} results)
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Edit Status Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Reservation</DialogTitle>
            <DialogDescription>
              {editingReservation?.serialNumber} — {editingReservation?.employeeName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm"
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleUpdateStatus} disabled={actionLoading} className="flex-1">
                {actionLoading ? 'Saving...' : 'Update'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Status Change Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <div className="flex justify-center mb-2"><AlertTriangle className="h-10 w-10 text-blue-500" /></div>
            <DialogTitle className="text-center">Update {selected.size} Reservation(s)?</DialogTitle>
            <DialogDescription className="text-center">
              Change status to <strong>{bulkStatus}</strong> for {selected.size} reservation(s). Each affected user will receive an email notification.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowBulkDialog(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleBulkStatusChange} disabled={actionLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {actionLoading ? 'Updating...' : 'Confirm'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
