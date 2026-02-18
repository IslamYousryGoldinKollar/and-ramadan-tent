import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getActiveDailyTips, getAllDailyTips, createDailyTip } from '@/lib/daily-tips'
import { sanitizeHtml } from '@/lib/html-sanitizer'
import { z } from 'zod'

const createTipSchema = z.object({
  title: z.string().min(1),
  shortTip: z.string().min(1),
  fullContent: z.string().min(1),
  tipNumber: z.number().int().positive(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'

    if (admin) {
      const session = await getServerSession(authOptions)
      if (session?.user && (session.user as any).role === 'ADMIN') {
        const tips = await getAllDailyTips()
        return NextResponse.json(tips)
      }
    }

    const tips = await getActiveDailyTips()
    return NextResponse.json(tips)
  } catch (error) {
    console.error('Error fetching daily tips:', error)
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
    const validated = createTipSchema.parse(body)
    const sanitized = {
      ...validated,
      fullContent: sanitizeHtml(validated.fullContent),
    }
    const tip = await createDailyTip(sanitized)
    return NextResponse.json(tip, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    console.error('Error creating daily tip:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
