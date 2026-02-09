import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { addToWaitingList } from '@/lib/waiting-list'
import { z } from 'zod'

const addToWaitingListSchema = z.object({
  targetDate: z.string().transform((str) => new Date(str)),
  requestedSeats: z.number().min(1).max(120),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = addToWaitingListSchema.parse(body)

    const waitingListEntry = await addToWaitingList(
      session.user.id,
      validated.targetDate,
      validated.requestedSeats
    )

    return NextResponse.json(waitingListEntry, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error adding to waiting list:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
