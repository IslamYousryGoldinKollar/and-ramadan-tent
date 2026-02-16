import { NextRequest, NextResponse } from 'next/server'
import { checkAvailability } from '@/lib/reservations'

// Simple in-memory cache to reduce Firestore reads under high concurrency
const cache = new Map<string, { data: any; expiresAt: number }>()
const CACHE_TTL_MS = 10_000 // 10 seconds

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

    // Check cache first
    const cached = cache.get(date)
    if (cached && Date.now() < cached.expiresAt) {
      return NextResponse.json(cached.data, {
        headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5' },
      })
    }

    const availability = await checkAvailability(new Date(date))

    // Store in cache
    cache.set(date, { data: availability, expiresAt: Date.now() + CACHE_TTL_MS })

    return NextResponse.json(availability, {
      headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5' },
    })
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
