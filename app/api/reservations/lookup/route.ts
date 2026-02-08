import { NextRequest, NextResponse } from 'next/server'
import { getReservationBySerial } from '@/lib/reservations'
import { z } from 'zod'

const lookupSchema = z.object({
  serialNumber: z.string(),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = lookupSchema.parse(body)

    const reservation = await getReservationBySerial(validated.serialNumber)

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Verify email matches
    // Check both user.email (for authenticated) and reservation.email (for public)
    const reservationEmail = reservation.email || reservation.user?.email
    if (!reservationEmail) {
      return NextResponse.json(
        { error: 'Reservation email not found' },
        { status: 404 }
      )
    }
    
    if (reservationEmail.toLowerCase() !== validated.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email does not match reservation' },
        { status: 403 }
      )
    }

    return NextResponse.json(reservation)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error looking up reservation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
