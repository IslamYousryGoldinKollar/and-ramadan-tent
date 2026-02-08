import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { updateQuestion, deleteQuestion } from '@/lib/riddles'
import { z } from 'zod'

const updateQuestionSchema = z.object({
  questionText: z.string().min(1).optional(),
  optionA: z.string().min(1).optional(),
  optionB: z.string().min(1).optional(),
  optionC: z.string().min(1).optional(),
  correctAnswer: z.enum(['A', 'B', 'C']).optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { episodeId: string; questionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validated = updateQuestionSchema.parse(body)
    const question = await updateQuestion(params.questionId, validated)
    return NextResponse.json(question)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    console.error('Error updating question:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { episodeId: string; questionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await deleteQuestion(params.questionId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
