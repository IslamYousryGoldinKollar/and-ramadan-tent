import { NextRequest, NextResponse } from 'next/server'
import { checkAvailabilityRange } from '@/lib/reservations'

// Simple in-memory cache to reduce Firestore reads under high concurrency
const cache = new Map<string, { data: any; expiresAt: number }>()
const CACHE_TTL_MS = 10_000 // 10 seconds

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

    // Check cache first
    const cacheKey = `${startDate}|${endDate}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() < cached.expiresAt) {
      return NextResponse.json(cached.data, {
        headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5' },
      })
    }

    const availability = await checkAvailabilityRange(
      new Date(startDate),
      new Date(endDate)
    )

    // Store in cache
    cache.set(cacheKey, { data: availability, expiresAt: Date.now() + CACHE_TTL_MS })

    return NextResponse.json(availability, {
      headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5' },
    })
  } catch (error) {
    console.error('Error checking availability range:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
