import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const lookupSchema = z.object({
  serialNumber: z.string(),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = lookupSchema.parse(body)

    const reservation = await prisma.reservation.findUnique({
      where: { serialNumber: validated.serialNumber },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Verify email matches
    if (reservation.email?.toLowerCase() !== validated.email.toLowerCase()) {
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
