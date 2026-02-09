import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import {
  getCorrectAnswerers,
  runRaffle,
  clearRaffleWinners,
  getRaffleWinners,
  getRaffleSettings,
} from '@/lib/riddles'
import { z } from 'zod'

const runRaffleSchema = z.object({
  numberOfWinners: z.number().int().positive(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [correctAnswerers, winners, settings] = await Promise.all([
      getCorrectAnswerers(params.episodeId),
      getRaffleWinners(params.episodeId),
      getRaffleSettings(params.episodeId),
    ])

    return NextResponse.json({
      correctAnswerers,
      winners,
      settings,
    })
  } catch (error) {
    console.error('Error fetching raffle data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validated = runRaffleSchema.parse(body)

    const winners = await runRaffle(params.episodeId, validated.numberOfWinners)

    return NextResponse.json({ success: true, winners }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error running raffle:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await clearRaffleWinners(params.episodeId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing raffle:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
