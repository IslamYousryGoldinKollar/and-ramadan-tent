import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { ReservationStatus, WaitingListStatus } from '@prisma/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const now = new Date()
    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)
    const endOfToday = new Date(now)
    endOfToday.setHours(23, 59, 59, 999)

    const [totalReservations, todayReservations, seatsAgg, waitingListCount] = await Promise.all([
      // Total active reservations
      prisma.reservation.count({
        where: {
          status: {
            in: [ReservationStatus.CONFIRMED, ReservationStatus.RESCHEDULED, ReservationStatus.CHECKED_IN],
          },
        },
      }),
      // Today's reservations
      prisma.reservation.count({
        where: {
          reservationDate: { gte: startOfToday, lte: endOfToday },
          status: {
            in: [ReservationStatus.CONFIRMED, ReservationStatus.RESCHEDULED, ReservationStatus.CHECKED_IN],
          },
        },
      }),
      // Total seats booked (aggregate)
      prisma.reservation.aggregate({
        _sum: { seatCount: true },
        where: {
          status: {
            in: [ReservationStatus.CONFIRMED, ReservationStatus.RESCHEDULED, ReservationStatus.CHECKED_IN],
          },
        },
      }),
      // Pending waiting list count
      prisma.waitingList.count({
        where: { status: WaitingListStatus.PENDING },
      }),
    ])

    return NextResponse.json({
      totalReservations,
      todayReservations,
      totalSeatsBooked: seatsAgg._sum.seatCount || 0,
      waitingListCount,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
