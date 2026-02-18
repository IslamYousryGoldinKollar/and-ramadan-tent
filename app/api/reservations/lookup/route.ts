import { NextRequest, NextResponse } from 'next/server'
import { getReservationBySerial } from '@/lib/reservations'
import { rateLimitDistributed, getClientIp } from '@/lib/rate-limit'
import { z } from 'zod'

const lookupSchema = z.object({
  serialNumber: z.string(),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const requestLimiter = await rateLimitDistributed(`lookup:ip:${ip}`, { windowMs: 60_000, maxRequests: 20 })
    if (!requestLimiter.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validated = lookupSchema.parse(body)

    const identityLimiter = await rateLimitDistributed(
      `lookup:identity:${ip}:${validated.serialNumber.toUpperCase()}:${validated.email.toLowerCase()}`,
      { windowMs: 15 * 60_000, maxRequests: 5 }
    )
    if (!identityLimiter.success) {
      return NextResponse.json(
        { error: 'Too many lookup attempts. Please try again later.' },
        { status: 429 }
      )
    }

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
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }
    
    if (reservationEmail.toLowerCase() !== validated.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
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
