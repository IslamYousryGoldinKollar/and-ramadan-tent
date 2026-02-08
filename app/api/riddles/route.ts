import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getActiveEpisodes, getAllEpisodes, createRiddleEpisode } from '@/lib/riddles'
import { z } from 'zod'

const createEpisodeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string().min(1),
  episodeNumber: z.number().int().positive(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'

    if (admin) {
      const session = await getServerSession(authOptions)
      if (session?.user && (session.user as any).role === 'ADMIN') {
        const episodes = await getAllEpisodes()
        return NextResponse.json(episodes)
      }
    }

    const episodes = await getActiveEpisodes()
    return NextResponse.json(episodes)
  } catch (error) {
    console.error('Error fetching episodes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validated = createEpisodeSchema.parse(body)

    const episode = await createRiddleEpisode(validated)
    return NextResponse.json(episode, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating episode:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
