import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import {
  getActiveWellnessContent,
  getAllWellnessContent,
  createWellnessContent,
} from '@/lib/wellness'
import { z } from 'zod'

const createContentSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  pdfUrl: z.string().url().optional(),
  displayOrder: z.number().int().default(0),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'

    if (admin) {
      const session = await getServerSession(authOptions)
      const isAdmin = session?.user && (session.user as any).role === 'ADMIN'
      if (isAdmin) {
        const content = await getAllWellnessContent()
        return NextResponse.json(content)
      }
    }

    const articles = await getActiveWellnessContent()
    const content = articles.map((a: any) => ({
      id: a.id,
      title: a.title,
      content: a.htmlContent || a.content || '',
      pdfUrl: a.imageUrl || null,
      displayOrder: a.displayOrder,
    }))
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching wellness content:', error)
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
    const validated = createContentSchema.parse(body)

    const content = await createWellnessContent(validated)
    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating wellness content:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
