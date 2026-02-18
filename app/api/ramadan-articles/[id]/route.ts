import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getArticleById, updateArticle, deleteArticle, toggleArticleStatus } from '@/lib/ramadan-tips'
import { getSignedMediaUrl } from '@/lib/uploads'
import { sanitizeHtml } from '@/lib/html-sanitizer'
import { z } from 'zod'

const updateArticleSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  htmlContent: z.string().min(1).optional(),
  category: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  displayOrder: z.number().int().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const isAdmin = !!session?.user && (session.user as any).role === 'ADMIN'

    const article = await getArticleById(params.id)
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    if (!isAdmin && !(article as any).isActive) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const [signedImageUrl, signedVideoUrl] = await Promise.all([
      getSignedMediaUrl((article as any).imageUrl),
      getSignedMediaUrl((article as any).videoUrl),
    ])

    if (isAdmin) {
      return NextResponse.json({
        ...article,
        imagePreviewUrl: signedImageUrl || (article as any).imageUrl || null,
        videoPreviewUrl: signedVideoUrl || (article as any).videoUrl || null,
      })
    }

    return NextResponse.json({
      ...article,
      imageUrl: signedImageUrl || (article as any).imageUrl || null,
      videoUrl: signedVideoUrl || (article as any).videoUrl || null,
    })
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validated = updateArticleSchema.parse(body)
    const sanitized = {
      ...validated,
      ...(validated.htmlContent ? { htmlContent: sanitizeHtml(validated.htmlContent) } : {}),
    }
    const article = await updateArticle(params.id, sanitized)
    return NextResponse.json(article)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await deleteArticle(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
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
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const article = await toggleArticleStatus(params.id)
    return NextResponse.json(article)
  } catch (error) {
    console.error('Error toggling article status:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
