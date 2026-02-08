import { NextRequest, NextResponse } from 'next/server'
import { getActiveDailyTips } from '@/lib/daily-tips'

export async function GET(request: NextRequest) {
  try {
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
