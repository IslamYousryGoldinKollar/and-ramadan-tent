import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { addQuestionToEpisode } from '@/lib/riddles'
import { z } from 'zod'

const createQuestionSchema = z.object({
  questionText: z.string().min(1),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  correctAnswer: z.enum(['A', 'B', 'C']),
})

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
    const validated = createQuestionSchema.parse(body)

    const question = await addQuestionToEpisode({
      episodeId: params.episodeId,
      ...validated,
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
