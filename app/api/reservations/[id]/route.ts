import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { cancelReservation, rescheduleReservation } from '@/lib/reservations'
import { prisma } from '@/lib/prisma'
import { ReservationStatus } from '@prisma/client'
import { z } from 'zod'

const rescheduleSchema = z.object({
  newDate: z.string().transform((str) => new Date(str)).optional(),
  status: z.nativeEnum(ReservationStatus).optional(),
})

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reservation = await cancelReservation(params.id, session.user.id)
    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error cancelling reservation:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = rescheduleSchema.parse(body)

    // Admin can update status directly (for check-in)
    if (validated.status && session.user.role === 'ADMIN') {
      const reservation = await prisma.reservation.update({
        where: { id: params.id },
        data: { status: validated.status },
        include: { user: true },
      })
      return NextResponse.json(reservation)
    }

    // Regular users can reschedule
    if (validated.newDate) {
      const reservation = await rescheduleReservation(
        params.id,
        session.user.id,
        validated.newDate
      )
      return NextResponse.json(reservation)
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating reservation:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
