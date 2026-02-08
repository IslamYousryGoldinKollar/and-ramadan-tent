import { NextRequest, NextResponse } from 'next/server'
import { trackPageView, updatePageView } from '@/lib/analytics'
import { z } from 'zod'

const pageViewSchema = z.object({
  sessionId: z.string().min(1),
  path: z.string().min(1),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
  device: z.string().optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
})

const updateSchema = z.object({
  id: z.string().min(1),
  duration: z.number().int().min(0),
  scrollDepth: z.number().int().min(0).max(100),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = pageViewSchema.parse(body)

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') || undefined

    const pageView = await trackPageView({
      ...validated,
      ip,
    })

    return NextResponse.json({ id: pageView.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    console.error('Error tracking page view:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = updateSchema.parse(body)

    await updatePageView(validated.id, validated.duration, validated.scrollDepth)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    console.error('Error updating page view:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
