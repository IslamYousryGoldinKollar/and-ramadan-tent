'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate } from '@/lib/utils'
import { Calendar, Users } from 'lucide-react'


interface BookingFormProps {
  selectedDate: Date | null
}

export function BookingForm({ selectedDate }: BookingFormProps) {
  const { data: session } = useSession()
  const [seatCount, setSeatCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<any>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const handleBooking = async () => {
    if (!selectedDate) {
      setError('Please select a date from the calendar')
      return
    }

    if (seatCount < 1 || seatCount > 20) {
      setError('Seat count must be between 1 and 20')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationDate: selectedDate.toISOString(),
          seatCount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create reservation')
      }

      setSuccess(data)
      setShowSuccessDialog(true)
      setSeatCount(1)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleFullTentBooking = () => {
    setSeatCount(20)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Make a Reservation
          </CardTitle>
          <CardDescription>
            {selectedDate
              ? `Selected: ${formatDate(selectedDate)}`
              : 'Select a date from the calendar'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seats">Number of Seats</Label>
            <div className="flex items-center gap-2">
              <Input
                id="seats"
                type="number"
                min="1"
                max="19"
                value={seatCount}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1
                  setSeatCount(Math.min(19, Math.max(1, value)))
                }}
                disabled={!selectedDate}
              />
              <Button
                variant="outline"
                onClick={handleFullTentBooking}
                disabled={!selectedDate}
              >
                Full Tent (20)
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Select 1-19 seats for partial booking, or click "Full Tent" for 20 seats
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleBooking}
            disabled={!selectedDate || loading || seatCount < 1}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reservation Confirmed!</DialogTitle>
            <DialogDescription>
              Your reservation has been successfully created.
            </DialogDescription>
          </DialogHeader>
          {success && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Serial Number:</span>
                    <p className="text-lg font-bold text-eand-red">{success.serialNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Date:</span>
                    <p>{formatDate(new Date(success.reservationDate))}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Seats:</span>
                    <p>{success.seatCount}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500">
                Booking confirmed. Save your serial number for reference.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
