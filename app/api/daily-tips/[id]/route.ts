import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getDailyTipById, updateDailyTip, deleteDailyTip, toggleDailyTipStatus } from '@/lib/daily-tips'
import { sanitizeHtml } from '@/lib/html-sanitizer'
import { z } from 'zod'

const updateTipSchema = z.object({
  title: z.string().min(1).optional(),
  shortTip: z.string().min(1).optional(),
  fullContent: z.string().min(1).optional(),
  tipNumber: z.number().int().positive().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const isAdmin = !!session?.user && (session.user as any).role === 'ADMIN'

    const tip = await getDailyTipById(params.id)
    if (!tip) {
      return NextResponse.json({ error: 'Tip not found' }, { status: 404 })
    }

    if (!isAdmin && !(tip as any).isActive) {
      return NextResponse.json({ error: 'Tip not found' }, { status: 404 })
    }

    return NextResponse.json(tip)
  } catch (error) {
    console.error('Error fetching daily tip:', error)
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
    const validated = updateTipSchema.parse(body)
    const sanitized = {
      ...validated,
      ...(validated.fullContent ? { fullContent: sanitizeHtml(validated.fullContent) } : {}),
    }
    const tip = await updateDailyTip(params.id, sanitized)
    return NextResponse.json(tip)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    console.error('Error updating daily tip:', error)
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

    await deleteDailyTip(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting daily tip:', error)
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

    const tip = await toggleDailyTipStatus(params.id)
    return NextResponse.json(tip)
  } catch (error) {
    console.error('Error toggling daily tip status:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
