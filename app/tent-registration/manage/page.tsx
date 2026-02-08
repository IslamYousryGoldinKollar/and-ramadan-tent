'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, X, RefreshCw, Search, CheckCircle2, XCircle } from 'lucide-react'
import Image from 'next/image'
import { EandLogo } from '@/components/ui/eand-logo'

interface ReservationDetails {
  id: string
  reservationDate: string
  seatCount: number
  status: string
  serialNumber: string
  qrCodeString: string
  email?: string
}

export default function ManageReservationPage() {
  const [serialNumber, setSerialNumber] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [reservation, setReservation] = useState<ReservationDetails | null>(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [newDate, setNewDate] = useState('')

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')
    setReservation(null)

    try {
      const response = await fetch('/api/public/reservations/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serialNumber, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Reservation not found')
      }

      setReservation(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!reservation) return

    try {
      const response = await fetch(`/api/public/reservations/${reservation.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to cancel reservation')
      }

      setShowCancelDialog(false)
      setReservation(null)
      setSerialNumber('')
      setEmail('')
      setSuccessMessage('Reservation cancelled successfully')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    }
  }

  const handleReschedule = async () => {
    if (!reservation || !newDate) return

    try {
      const response = await fetch(`/api/public/reservations/${reservation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newDate }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reschedule reservation')
      }

      setShowRescheduleDialog(false)
      setReservation(data)
      setNewDate('')
      setSuccessMessage('Reservation rescheduled successfully!')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-ramadan-subtle flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-eand-ocean/95 backdrop-blur-md border-b border-white/10 safe-top">
        <div className="content-container py-3 flex items-center justify-between">
          <Link href="/tent-registration" className="flex items-center gap-2 text-white/70 active:text-ramadan-gold">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Register</span>
          </Link>
          <EandLogo size="sm" className="brightness-0 invert" />
        </div>
      </header>

      <main className="flex-1 py-6 lg:py-10">
        <div className="content-container space-y-5">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Booking</h1>
          <p className="text-sm text-gray-500">Look up, reschedule, or cancel your reservation</p>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Lookup Form */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4" />
              Find Your Reservation
            </CardTitle>
            <CardDescription className="text-sm">
              Enter your serial number and email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLookup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  inputMode="text"
                  autoComplete="off"
                  placeholder="RAM-26-XXXX"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="your.name@eand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full rounded-2xl py-5 bg-eand-ocean hover:bg-eand-ocean/90 active:scale-[0.98] transition-transform" disabled={loading}>
                {loading ? 'Looking up...' : 'Find Reservation'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Reservation Details */}
        {reservation && (
          <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Your Reservation</CardTitle>
                <Badge
                  variant={reservation.status === 'CANCELLED' ? 'destructive' : 'success'}
                  className="text-xs"
                >
                  {reservation.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-500">Serial Number</span>
                  <p className="text-lg font-bold text-eand-red">{reservation.serialNumber}</p>
                </div>
                <div className="flex gap-6">
                  <div>
                    <span className="text-xs font-medium text-gray-500">Date</span>
                    <p className="text-sm font-medium">{formatDate(new Date(reservation.reservationDate))}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500">Seats</span>
                    <p className="text-sm font-medium">{reservation.seatCount}</p>
                  </div>
                </div>
              </div>

              {reservation.qrCodeString && (
                <div className="flex justify-center py-2">
                  <Image
                    src={reservation.qrCodeString}
                    alt="QR Code"
                    width={160}
                    height={160}
                    className="border rounded-xl"
                  />
                </div>
              )}

              {reservation.status !== 'CANCELLED' && (
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRescheduleDialog(true)}
                    className="flex-1 rounded-xl"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Change Date
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowCancelDialog(true)}
                    className="flex-1 rounded-xl"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        </div>
      </main>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Cancel Reservation?</DialogTitle>
            <DialogDescription>
              This cannot be undone. Your seat will be released.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="flex-1 rounded-xl">
              Keep It
            </Button>
            <Button variant="destructive" onClick={handleCancel} className="flex-1 rounded-xl">
              Yes, Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Change Date</DialogTitle>
            <DialogDescription>
              Pick a new date for your reservation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newDate">New Date</Label>
              <Input
                id="newDate"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowRescheduleDialog(false)} className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleReschedule} className="flex-1 rounded-xl" disabled={!newDate}>
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
