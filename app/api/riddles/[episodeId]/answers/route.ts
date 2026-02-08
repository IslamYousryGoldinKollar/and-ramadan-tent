import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { submitRiddleAnswers, getEpisodeAnswers } from '@/lib/riddles'
import { z } from 'zod'
import { isValidEandEmail } from '@/lib/utils'

const submitAnswersSchema = z.object({
  employeeId: z.string().min(1),
  employeeName: z.string().min(1),
  email: z.string().email(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedAnswer: z.enum(['A', 'B', 'C', 'D']),
    })
  ),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  try {
    const body = await request.json()
    const validated = submitAnswersSchema.parse(body)

    // Validate email domain
    if (!isValidEandEmail(validated.email)) {
      return NextResponse.json(
        { error: 'Email must be from @eand.com domain' },
        { status: 400 }
      )
    }

    const answers = await submitRiddleAnswers({
      episodeId: params.episodeId,
      ...validated,
    })

    return NextResponse.json({ success: true, answers }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error submitting answers:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const answers = await getEpisodeAnswers(params.episodeId)
    return NextResponse.json(answers)
  } catch (error) {
    console.error('Error fetching answers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
