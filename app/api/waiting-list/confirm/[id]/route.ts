import { NextRequest, NextResponse } from 'next/server'
import { confirmWaitingListEntry } from '@/lib/waiting-list'
import { createReservation } from '@/lib/reservations'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Confirmation token is required' },
        { status: 401 }
      )
    }

    // Verify token matches the waiting list entry
    const waitingListEntry = await prisma.waitingList.findUnique({
      where: { id: params.id },
    })

    if (!waitingListEntry || waitingListEntry.confirmationToken !== token) {
      return NextResponse.json(
        { error: 'Invalid confirmation token' },
        { status: 403 }
      )
    }

    const entry = await confirmWaitingListEntry(params.id)

    // Create reservation from waiting list entry
    const reservation = await createReservation(
      entry.userId,
      entry.targetDate,
      entry.requestedSeats
    )

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    console.error('Error confirming waiting list entry:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
