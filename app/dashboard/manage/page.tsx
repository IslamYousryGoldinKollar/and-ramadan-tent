'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate } from '@/lib/utils'
import { Search, Calendar, Users, X, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ReservationDetails {
  id: string
  reservationDate: string
  seatCount: number
  status: string
  serialNumber: string
  qrCodeString: string
  user: {
    email: string
  }
}

export default function ManageReservationPage() {
  const router = useRouter()
  const [serialNumber, setSerialNumber] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [reservation, setReservation] = useState<ReservationDetails | null>(null)
  const [error, setError] = useState('')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [newDate, setNewDate] = useState('')

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setReservation(null)

    try {
      const response = await fetch('/api/reservations/lookup', {
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
      const response = await fetch(`/api/reservations/${reservation.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to cancel reservation')
      }

      setShowCancelDialog(false)
      setReservation(null)
      setSerialNumber('')
      setEmail('')
      router.refresh()
      alert('Reservation cancelled successfully')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    }
  }

  const handleReschedule = async () => {
    if (!reservation || !newDate) return

    try {
      const response = await fetch(`/api/reservations/${reservation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDate }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reschedule reservation')
      }

      setShowRescheduleDialog(false)
      setReservation(data)
      setNewDate('')
      router.refresh()
      alert('Reservation rescheduled successfully')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Search className="h-8 w-8" />
            Manage Reservation
          </h1>
          <p className="text-gray-600 mt-2">
            Look up your reservation using your Serial Number and Email
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lookup Reservation</CardTitle>
            <CardDescription>
              Enter your reservation serial number and email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLookup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  placeholder="RAM-24-9088"
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
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Looking up...' : 'Lookup Reservation'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {reservation && (
          <Card className="modern-card animate-fade-in-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reservation Details</CardTitle>
                <Badge variant={reservation.status === 'CANCELLED' ? 'destructive' : 'success'}>
                  {reservation.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Serial Number</Label>
                  <p className="font-semibold text-lg">{reservation.serialNumber}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Date</Label>
                  <p className="font-semibold">{formatDate(new Date(reservation.reservationDate))}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Seats</Label>
                  <p className="font-semibold">{reservation.seatCount}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Status</Label>
                  <p className="font-semibold">{reservation.status}</p>
                </div>
              </div>

              {reservation.qrCodeString && (
                <div className="flex justify-center pt-4 border-t">
                  <Image
                    src={reservation.qrCodeString}
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="border rounded-lg"
                  />
                </div>
              )}

              {reservation.status !== 'CANCELLED' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={() => setShowCancelDialog(true)}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Reservation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRescheduleDialog(true)}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Change Date
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Reservation</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this reservation? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="flex-1">
                No, Keep It
              </Button>
              <Button variant="destructive" onClick={handleCancel} className="flex-1">
                Yes, Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Reservation Date</DialogTitle>
              <DialogDescription>
                Select a new date for your reservation
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
                <Button variant="outline" onClick={() => setShowRescheduleDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleReschedule} className="flex-1" disabled={!newDate}>
                  Confirm Change
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
