'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { BookOpen, Calendar, Users } from 'lucide-react'
import Image from 'next/image'

interface Reservation {
  id: string
  reservationDate: string
  seatCount: number
  status: string
  serialNumber: string
  qrCodeString: string
}

export default function MyBookingsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations')
      if (response.ok) {
        const data = await response.json()
        setReservations(data)
      }
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      CONFIRMED: 'success',
      RESCHEDULED: 'secondary',
      CANCELLED: 'destructive',
      CHECKED_IN: 'default',
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            My Bookings
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage your Ramadan Tent reservations
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eand-red"></div>
          </div>
        ) : reservations.length === 0 ? (
          <Card className="text-center">
            <CardContent className="py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reservations found</p>
              <p className="text-sm text-gray-500 mt-2">
                Make your first reservation from the Dashboard
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="modern-card-hover group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{reservation.serialNumber}</CardTitle>
                    {getStatusBadge(reservation.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formatDate(new Date(reservation.reservationDate))}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{reservation.seatCount} {reservation.seatCount === 1 ? 'seat' : 'seats'}</span>
                    </div>
                  </div>
                  {reservation.qrCodeString && (
                    <div className="flex justify-center pt-2 border-t">
                      <Image
                        src={reservation.qrCodeString}
                        alt="QR Code"
                        width={150}
                        height={150}
                        className="border rounded-lg"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
