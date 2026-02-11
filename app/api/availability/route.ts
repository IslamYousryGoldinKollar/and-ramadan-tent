import { NextRequest, NextResponse } from 'next/server'
import { checkAvailability } from '@/lib/reservations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    const availability = await checkAvailability(new Date(date))
    return NextResponse.json(availability)
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Internal server error', debug: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5) : undefined },
      { status: 500 }
    )
  }
}
