import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import {
  getAnalyticsOverview,
  getPageViewsOverTime,
  getHourlyTraffic,
  getRecentSessions,
  getTopReferrers,
  getEventCounts,
} from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    const now = new Date()
    let startDate: Date

    switch (range) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default: {
        const customStart = searchParams.get('start')
        startDate = customStart ? new Date(customStart) : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      }
    }

    const customEnd = searchParams.get('end')
    const endDate = customEnd ? new Date(customEnd) : now

    const [overview, viewsOverTime, hourlyTraffic, recentSessions, topReferrers, eventCounts] =
      await Promise.all([
        getAnalyticsOverview(startDate, endDate),
        getPageViewsOverTime(startDate, endDate),
        getHourlyTraffic(startDate, endDate),
        getRecentSessions(50),
        getTopReferrers(startDate, endDate, 10),
        getEventCounts(startDate, endDate),
      ])

    return NextResponse.json({
      overview,
      viewsOverTime,
      hourlyTraffic,
      recentSessions,
      topReferrers,
      eventCounts,
      dateRange: { start: startDate.toISOString(), end: endDate.toISOString() },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
