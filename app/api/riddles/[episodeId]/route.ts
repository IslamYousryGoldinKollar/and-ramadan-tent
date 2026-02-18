import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getEpisodeById, updateRiddleEpisode, deleteRiddleEpisode, toggleEpisodeStatus } from '@/lib/riddles'
import { getSignedMediaUrl } from '@/lib/uploads'
import { z } from 'zod'

const updateEpisodeSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  videoUrl: z.string().min(1).optional(),
  episodeNumber: z.number().int().positive().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const isAdmin = !!session?.user && (session.user as any).role === 'ADMIN'

    const episode = await getEpisodeById(params.episodeId, {
      includeCorrectAnswers: isAdmin,
    })

    if (!episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      )
    }

    if (!isAdmin && !(episode as any).isActive) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      )
    }

    const signedVideoUrl = await getSignedMediaUrl((episode as any).videoUrl)
    return NextResponse.json({
      ...episode,
      videoUrl: signedVideoUrl || (episode as any).videoUrl,
    })
  } catch (error) {
    console.error('Error fetching episode:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validated = updateEpisodeSchema.parse(body)
    const episode = await updateRiddleEpisode(params.episodeId, validated)
    return NextResponse.json(episode)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    console.error('Error updating episode:', error)
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

    await deleteRiddleEpisode(params.episodeId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting episode:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const episode = await toggleEpisodeStatus(params.episodeId)
    return NextResponse.json(episode)
  } catch (error) {
    console.error('Error toggling episode status:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
