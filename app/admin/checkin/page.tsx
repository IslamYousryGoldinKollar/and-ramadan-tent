'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Search, CheckCircle, XCircle, QrCode } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ReservationDetails {
  id: string
  reservationDate: string
  seatCount: number
  status: string
  serialNumber: string
  qrCodeString: string
  user: {
    fullName: string
    employeeId: string
    email: string
    department: string | null
  }
}

export default function AdminCheckInPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [serialNumber, setSerialNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [reservation, setReservation] = useState<ReservationDetails | null>(null)
  const [error, setError] = useState('')
  const [checkedIn, setCheckedIn] = useState(false)

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [session, router])

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setReservation(null)
    setCheckedIn(false)

    try {
      const response = await fetch(`/api/admin/reservations/${serialNumber}`)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Reservation not found')
      }

      setReservation(data)
      setCheckedIn(data.status === 'CHECKED_IN')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    if (!reservation) return

    try {
      const response = await fetch(`/api/admin/reservations/${reservation.serialNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CHECKED_IN',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to check in')
      }

      const updated = await response.json()
      setCheckedIn(true)
      setReservation(updated)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    }
  }

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <QrCode className="h-8 w-8" />
            Check-in System
          </h1>
          <p className="text-gray-600 mt-2">
            Scan QR code or enter serial number to check in guests
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lookup Reservation</CardTitle>
            <CardDescription>
              Enter serial number or scan QR code
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
                  autoFocus
                />
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Looking up...' : 'Lookup'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {reservation && (
          <Card className="modern-card animate-fade-in-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reservation Details</CardTitle>
                {checkedIn ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Checked In
                  </Badge>
                ) : (
                  <Badge variant="secondary">Pending</Badge>
                )}
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
                  <Label className="text-xs text-gray-500">Employee Name</Label>
                  <p className="font-semibold">{reservation.user.fullName}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Employee ID</Label>
                  <p className="font-semibold">{reservation.user.employeeId}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Department</Label>
                  <p className="font-semibold">{reservation.user.department || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Seats</Label>
                  <p className="font-semibold">{reservation.seatCount}</p>
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

              {!checkedIn && (
                <Button onClick={handleCheckIn} className="w-full" size="lg">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Checked In
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
