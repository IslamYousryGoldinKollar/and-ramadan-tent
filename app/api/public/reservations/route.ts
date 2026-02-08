import { NextRequest, NextResponse } from 'next/server'
import { createPublicReservation } from '@/lib/reservations'
import { isValidEandEmail } from '@/lib/utils'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { z } from 'zod'

const createReservationSchema = z.object({
  employeeId: z.string().min(1),
  employeeName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(10, 'Valid mobile number is required'),
  reservationDate: z.string().transform((str) => new Date(str)),
  seatCount: z.number().min(1).max(10),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 requests per minute per IP
    const ip = getClientIp(request)
    const limiter = rateLimit(`public-reservation:${ip}`, { windowMs: 60_000, maxRequests: 5 })
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validated = createReservationSchema.parse(body)

    // Validate email domain
    if (!isValidEandEmail(validated.email)) {
      return NextResponse.json(
        { error: 'Email must be from @eand.com domain' },
        { status: 400 }
      )
    }

    const reservation = await createPublicReservation(
      validated.employeeId,
      validated.employeeName,
      validated.email,
      validated.phoneNumber,
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
