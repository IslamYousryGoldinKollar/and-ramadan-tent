import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getActiveArticles, getAllArticles, createArticle, ARTICLE_CATEGORIES } from '@/lib/ramadan-tips'
import { z } from 'zod'

const createArticleSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().optional(),
  htmlContent: z.string().min(1),
  category: z.string().default('General'),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  displayOrder: z.number().int().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined

    if (admin) {
      const session = await getServerSession(authOptions)
      if (session?.user && (session.user as any).role === 'ADMIN') {
        const articles = await getAllArticles({ category, search })
        return NextResponse.json(articles)
      }
    }

    const articles = await getActiveArticles(category)
    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validated = createArticleSchema.parse(body)
    const article = await createArticle(validated)
    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
