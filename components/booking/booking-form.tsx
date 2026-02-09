'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate, MAX_CAPACITY } from '@/lib/utils'
import { Calendar, Users } from 'lucide-react'


interface BookingFormProps {
  selectedDate: Date | null
}

export function BookingForm({ selectedDate }: BookingFormProps) {
  const [seatCount, setSeatCount] = useState(1)
  const [availableSeats, setAvailableSeats] = useState<number | null>(null)
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<any>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const maxSeatsForDate = Math.min(MAX_CAPACITY, availableSeats ?? MAX_CAPACITY)
  const maxSelectableSeats = Math.max(1, maxSeatsForDate)

  const fullTentButtonText =
    maxSeatsForDate <= 0
      ? 'Sold Out'
      : maxSeatsForDate === MAX_CAPACITY
        ? `Full Tent (${MAX_CAPACITY})`
        : `Max (${maxSeatsForDate})`

  useEffect(() => {
    let cancelled = false

    async function fetchAvailability() {
      if (!selectedDate) {
        setAvailableSeats(null)
        return
      }

      setAvailabilityLoading(true)
      try {
        const response = await fetch(
          `/api/availability?date=${encodeURIComponent(selectedDate.toISOString())}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch availability')
        }

        const data: { availableSeats: number } = await response.json()
        if (!cancelled) {
          setAvailableSeats(data.availableSeats)
        }
      } catch {
        if (!cancelled) {
          setAvailableSeats(null)
        }
      } finally {
        if (!cancelled) {
          setAvailabilityLoading(false)
        }
      }
    }

    fetchAvailability()
    return () => {
      cancelled = true
    }
  }, [selectedDate])

  useEffect(() => {
    setSeatCount((prev) => Math.min(prev, maxSelectableSeats))
  }, [maxSelectableSeats])

  const handleBooking = async () => {
    if (!selectedDate) {
      setError('Please select a date from the calendar')
      return
    }

    if (seatCount < 1 || seatCount > maxSelectableSeats) {
      setError(`Seat count must be between 1 and ${maxSelectableSeats}`)
      return
    }

    if (availableSeats !== null && seatCount > availableSeats) {
      setError(`Only ${availableSeats} seats available`)
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
    setSeatCount(maxSelectableSeats)
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
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="seats">Number of Seats</Label>
              {selectedDate && (
                <Badge
                  variant={
                    availabilityLoading
                      ? 'secondary'
                      : availableSeats === null
                        ? 'outline'
                        : availableSeats > 0
                          ? 'success'
                          : 'destructive'
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {availabilityLoading
                      ? 'Checking...'
                      : availableSeats === null
                        ? `Up to ${MAX_CAPACITY}`
                        : availableSeats > 0
                          ? `${availableSeats} left`
                          : 'Sold out'}
                  </span>
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="seats"
                type="number"
                min="1"
                max={maxSelectableSeats}
                value={seatCount}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1
                  setSeatCount(Math.min(maxSelectableSeats, Math.max(1, value)))
                }}
                disabled={!selectedDate || availabilityLoading || maxSeatsForDate <= 0}
              />
              <Button
                variant="outline"
                onClick={handleFullTentBooking}
                disabled={!selectedDate || availabilityLoading || maxSeatsForDate <= 0}
              >
                {fullTentButtonText}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              {maxSeatsForDate <= 0
                ? 'No seats available for this date'
                : `Select 1-${maxSelectableSeats} seats. Tent capacity is ${MAX_CAPACITY} seats.`}
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
            disabled={
              !selectedDate ||
              loading ||
              availabilityLoading ||
              seatCount < 1 ||
              maxSeatsForDate <= 0 ||
              (availableSeats !== null && seatCount > availableSeats)
            }
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
