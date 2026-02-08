import { NextRequest, NextResponse } from 'next/server'
import { checkAvailabilityRange } from '@/lib/reservations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate parameters are required' },
        { status: 400 }
      )
    }

    const availability = await checkAvailabilityRange(
      new Date(startDate),
      new Date(endDate)
    )

    return NextResponse.json(availability)
  } catch (error) {
    console.error('Error checking availability range:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
