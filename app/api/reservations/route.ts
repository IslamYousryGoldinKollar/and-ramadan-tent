import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { createReservation, getUserReservations, getReservationsForDateRange } from '@/lib/reservations'
import { z } from 'zod'

const createReservationSchema = z.object({
  reservationDate: z.string().transform((str) => new Date(str)),
  seatCount: z.number().min(1).max(110),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (startDate && endDate) {
      // Admin calendar view
      if (session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const reservations = await getReservationsForDateRange(
        new Date(startDate),
        new Date(endDate)
      )
      return NextResponse.json(reservations)
    }

    // User's own reservations
    const reservations = await getUserReservations(session.user.id)
    return NextResponse.json(reservations)
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = createReservationSchema.parse(body)

    // Reject Fridays and Saturdays
    const dayOfWeek = new Date(validated.reservationDate).getDay()
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      return NextResponse.json(
        { error: 'The tent is closed on Fridays and Saturdays.' },
        { status: 400 }
      )
    }

    // Enforce 48-hour advance booking
    const minBookingDate = new Date()
    minBookingDate.setHours(minBookingDate.getHours() + 48)
    minBookingDate.setHours(0, 0, 0, 0)
    const reservationDay = new Date(validated.reservationDate)
    reservationDay.setHours(0, 0, 0, 0)
    if (reservationDay < minBookingDate) {
      return NextResponse.json(
        { error: 'Bookings must be made at least 48 hours in advance.' },
        { status: 400 }
      )
    }

    const reservation = await createReservation(
      session.user.id,
      validated.reservationDate,
      validated.seatCount
    )

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
