import { prisma } from './prisma'

export interface TrackPageViewData {
  sessionId: string
  path: string
  referrer?: string
  userAgent?: string
  ip?: string
  device?: string
  browser?: string
  os?: string
}

export interface TrackEventData {
  sessionId: string
  eventName: string
  eventData?: Record<string, any>
  path: string
}

/**
 * Record a page view
 */
export async function trackPageView(data: TrackPageViewData) {
  return prisma.pageView.create({
    data: {
      sessionId: data.sessionId,
      path: data.path,
      referrer: data.referrer,
      userAgent: data.userAgent,
      ip: data.ip,
      device: data.device,
      browser: data.browser,
      os: data.os,
    },
  })
}

/**
 * Update page view with duration and scroll depth (on page leave)
 */
export async function updatePageView(id: string, duration: number, scrollDepth: number) {
  return prisma.pageView.update({
    where: { id },
    data: { duration, scrollDepth },
  })
}

/**
 * Record a custom analytics event
 */
export async function trackEvent(data: TrackEventData) {
  return prisma.analyticsEvent.create({
    data: {
      sessionId: data.sessionId,
      eventName: data.eventName,
      eventData: data.eventData ? JSON.stringify(data.eventData) : null,
      path: data.path,
    },
  })
}

/**
 * Get analytics overview for a date range
 */
export async function getAnalyticsOverview(startDate: Date, endDate: Date) {
  const where = {
    createdAt: { gte: startDate, lte: endDate },
  }

  const [
    totalPageViews,
    uniqueSessions,
    avgDuration,
    deviceBreakdown,
    topPages,
    browserBreakdown,
    osBreakdown,
  ] = await Promise.all([
    prisma.pageView.count({ where }),
    prisma.pageView.findMany({
      where,
      distinct: ['sessionId'],
      select: { sessionId: true },
    }),
    prisma.pageView.aggregate({
      where,
      _avg: { duration: true, scrollDepth: true },
    }),
    prisma.pageView.groupBy({
      by: ['device'],
      where,
      _count: true,
      orderBy: { _count: { device: 'desc' } },
    }),
    prisma.pageView.groupBy({
      by: ['path'],
      where,
      _count: true,
      _avg: { duration: true, scrollDepth: true },
      orderBy: { _count: { path: 'desc' } },
      take: 20,
    }),
    prisma.pageView.groupBy({
      by: ['browser'],
      where,
      _count: true,
      orderBy: { _count: { browser: 'desc' } },
      take: 10,
    }),
    prisma.pageView.groupBy({
      by: ['os'],
      where,
      _count: true,
      orderBy: { _count: { os: 'desc' } },
      take: 10,
    }),
  ])

  // Calculate bounce rate (sessions with only 1 page view)
  const sessionPageCounts = await prisma.pageView.groupBy({
    by: ['sessionId'],
    where,
    _count: true,
  })
  const bounceSessions = sessionPageCounts.filter((s) => s._count === 1).length
  const bounceRate = sessionPageCounts.length > 0
    ? Math.round((bounceSessions / sessionPageCounts.length) * 100)
    : 0

  return {
    totalPageViews,
    uniqueVisitors: uniqueSessions.length,
    avgDuration: Math.round(avgDuration._avg.duration || 0),
    avgScrollDepth: Math.round(avgDuration._avg.scrollDepth || 0),
    bounceRate,
    deviceBreakdown: deviceBreakdown.map((d) => ({
      device: d.device || 'unknown',
      count: d._count,
    })),
    topPages: topPages.map((p) => ({
      path: p.path,
      views: p._count,
      avgDuration: Math.round(p._avg.duration || 0),
      avgScrollDepth: Math.round(p._avg.scrollDepth || 0),
    })),
    browserBreakdown: browserBreakdown.map((b) => ({
      browser: b.browser || 'unknown',
      count: b._count,
    })),
    osBreakdown: osBreakdown.map((o) => ({
      os: o.os || 'unknown',
      count: o._count,
    })),
  }
}

/**
 * Get page views over time (for line chart)
 */
export async function getPageViewsOverTime(startDate: Date, endDate: Date) {
  const views = await prisma.pageView.findMany({
    where: { createdAt: { gte: startDate, lte: endDate } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  // Group by day
  const grouped: Record<string, number> = {}
  for (const v of views) {
    const day = v.createdAt.toISOString().split('T')[0]
    grouped[day] = (grouped[day] || 0) + 1
  }

  return Object.entries(grouped).map(([date, count]) => ({ date, count }))
}

/**
 * Get hourly traffic distribution
 */
export async function getHourlyTraffic(startDate: Date, endDate: Date) {
  const views = await prisma.pageView.findMany({
    where: { createdAt: { gte: startDate, lte: endDate } },
    select: { createdAt: true },
  })

  const hourly = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }))
  for (const v of views) {
    const hour = v.createdAt.getHours()
    hourly[hour].count++
  }

  return hourly
}

/**
 * Get recent sessions
 */
export async function getRecentSessions(limit: number = 50) {
  const sessions = await prisma.pageView.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit * 3, // get more to group
    select: {
      sessionId: true,
      path: true,
      device: true,
      browser: true,
      os: true,
      duration: true,
      createdAt: true,
    },
  })

  // Group by session
  const sessionMap = new Map<string, typeof sessions>()
  for (const view of sessions) {
    if (!sessionMap.has(view.sessionId)) {
      sessionMap.set(view.sessionId, [])
    }
    sessionMap.get(view.sessionId)!.push(view)
  }

  return Array.from(sessionMap.entries())
    .slice(0, limit)
    .map(([sessionId, views]) => ({
      sessionId,
      pagesVisited: views.length,
      pages: views.map((v) => v.path),
      device: views[0].device,
      browser: views[0].browser,
      os: views[0].os,
      totalDuration: views.reduce((sum, v) => sum + v.duration, 0),
      startedAt: views[views.length - 1].createdAt,
    }))
}

/**
 * Get top referrers
 */
export async function getTopReferrers(startDate: Date, endDate: Date, limit: number = 10) {
  const referrers = await prisma.pageView.groupBy({
    by: ['referrer'],
    where: {
      createdAt: { gte: startDate, lte: endDate },
      referrer: { not: null },
    },
    _count: true,
    orderBy: { _count: { referrer: 'desc' } },
    take: limit,
  })

  return referrers
    .filter((r) => r.referrer)
    .map((r) => ({
      referrer: r.referrer!,
      count: r._count,
    }))
}

/**
 * Get event counts by name
 */
export async function getEventCounts(startDate: Date, endDate: Date) {
  return prisma.analyticsEvent.groupBy({
    by: ['eventName'],
    where: { createdAt: { gte: startDate, lte: endDate } },
    _count: true,
    orderBy: { _count: { eventName: 'desc' } },
  })
}
