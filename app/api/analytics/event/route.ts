import { NextRequest, NextResponse } from 'next/server'
import { trackEvent } from '@/lib/analytics'
import { z } from 'zod'

const eventSchema = z.object({
  sessionId: z.string().min(1),
  eventName: z.string().min(1),
  eventData: z.record(z.any()).optional(),
  path: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = eventSchema.parse(body)

    await trackEvent(validated)
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    console.error('Error tracking event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
