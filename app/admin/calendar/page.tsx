'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Calendar, Users, Download } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Reservation {
  id: string
  reservationDate: string
  seatCount: number
  status: string
  serialNumber: string
  user: {
    fullName: string
    employeeId: string
    department: string | null
  }
}

export default function AdminCalendarPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchReservations()
  }, [session, router, selectedDate])

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const startDate = new Date(selectedDate)
      startDate.setDate(startDate.getDate() - 7) // Show week before
      const endDate = new Date(selectedDate)
      endDate.setDate(endDate.getDate() + 30) // Show 30 days ahead

      const response = await fetch(
        `/api/reservations?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      )

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

  const handleExport = () => {
    const csv = [
      ['Date', 'Serial Number', 'Employee Name', 'Employee ID', 'Department', 'Seats', 'Status'],
      ...reservations.map((r) => [
        formatDate(new Date(r.reservationDate)),
        r.serialNumber,
        r.user.fullName,
        r.user.employeeId,
        r.user.department || 'N/A',
        r.seatCount.toString(),
        r.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ramadan-tent-reservations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const reservationsByDate = reservations.reduce((acc, reservation) => {
    const dateKey = new Date(reservation.reservationDate).toDateString()
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(reservation)
    return acc
  }, {} as Record<string, Reservation[]>)

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-8 w-8" />
              Calendar View
            </h1>
            <p className="text-gray-600 mt-2">
              Master view of all reservations across Ramadan
            </p>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eand-red"></div>
            </div>
          ) : Object.keys(reservationsByDate).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reservations found</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(reservationsByDate)
              .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
              .map(([date, dateReservations]) => (
                <Card key={date}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{formatDate(new Date(date))}</CardTitle>
                      <Badge>
                        {dateReservations.reduce((sum, r) => sum + r.seatCount, 0)} / 20 seats
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dateReservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-semibold">{reservation.user.fullName}</div>
                            <div className="text-sm text-gray-600">
                              {reservation.user.employeeId} • {reservation.user.department || 'N/A'}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-semibold">{reservation.seatCount} seats</div>
                              <div className="text-xs text-gray-500">{reservation.serialNumber}</div>
                            </div>
                            <Badge variant={reservation.status === 'CONFIRMED' ? 'success' : 'secondary'}>
                              {reservation.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
