import { db, generateId, toPlainObject, docsToArray } from './db'

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
  const id = generateId()
  const doc = {
    sessionId: data.sessionId,
    path: data.path,
    referrer: data.referrer || null,
    userAgent: data.userAgent || null,
    ip: data.ip || null,
    device: data.device || null,
    browser: data.browser || null,
    os: data.os || null,
    duration: 0,
    scrollDepth: 0,
    createdAt: new Date(),
  }
  await db.collection('pageViews').doc(id).set(doc)
  return { id, ...doc }
}

/**
 * Update page view with duration and scroll depth
 */
export async function updatePageView(id: string, duration: number, scrollDepth: number) {
  await db.collection('pageViews').doc(id).update({ duration, scrollDepth })
  return { id, duration, scrollDepth }
}

/**
 * Record a custom analytics event
 */
export async function trackEvent(data: TrackEventData) {
  const id = generateId()
  const doc = {
    sessionId: data.sessionId,
    eventName: data.eventName,
    eventData: data.eventData ? JSON.stringify(data.eventData) : null,
    path: data.path,
    createdAt: new Date(),
  }
  await db.collection('analyticsEvents').doc(id).set(doc)
  return { id, ...doc }
}

/**
 * Get analytics overview for a date range
 */
export async function getAnalyticsOverview(startDate: Date, endDate: Date) {
  const snap = await db.collection('pageViews')
    .where('createdAt', '>=', startDate)
    .where('createdAt', '<=', endDate)
    .get()

  const views = docsToArray(snap) as any[]
  const totalPageViews = views.length

  // Unique sessions
  const sessionSet = new Set(views.map((v) => v.sessionId))

  // Averages
  const totalDuration = views.reduce((s, v) => s + (v.duration || 0), 0)
  const totalScroll = views.reduce((s, v) => s + (v.scrollDepth || 0), 0)

  // Device breakdown
  const deviceMap: Record<string, number> = {}
  for (const v of views) {
    const d = v.device || 'unknown'
    deviceMap[d] = (deviceMap[d] || 0) + 1
  }

  // Top pages
  const pageMap: Record<string, { count: number; duration: number; scroll: number }> = {}
  for (const v of views) {
    if (!pageMap[v.path]) pageMap[v.path] = { count: 0, duration: 0, scroll: 0 }
    pageMap[v.path].count++
    pageMap[v.path].duration += v.duration || 0
    pageMap[v.path].scroll += v.scrollDepth || 0
  }

  // Browser breakdown
  const browserMap: Record<string, number> = {}
  for (const v of views) {
    const b = v.browser || 'unknown'
    browserMap[b] = (browserMap[b] || 0) + 1
  }

  // OS breakdown
  const osMap: Record<string, number> = {}
  for (const v of views) {
    const o = v.os || 'unknown'
    osMap[o] = (osMap[o] || 0) + 1
  }

  // Bounce rate
  const sessionPageCounts: Record<string, number> = {}
  for (const v of views) {
    sessionPageCounts[v.sessionId] = (sessionPageCounts[v.sessionId] || 0) + 1
  }
  const sessionEntries = Object.values(sessionPageCounts)
  const bounceSessions = sessionEntries.filter((c) => c === 1).length
  const bounceRate = sessionEntries.length > 0
    ? Math.round((bounceSessions / sessionEntries.length) * 100)
    : 0

  return {
    totalPageViews,
    uniqueVisitors: sessionSet.size,
    avgDuration: totalPageViews > 0 ? Math.round(totalDuration / totalPageViews) : 0,
    avgScrollDepth: totalPageViews > 0 ? Math.round(totalScroll / totalPageViews) : 0,
    bounceRate,
    deviceBreakdown: Object.entries(deviceMap)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count),
    topPages: Object.entries(pageMap)
      .map(([path, data]) => ({
        path,
        views: data.count,
        avgDuration: data.count > 0 ? Math.round(data.duration / data.count) : 0,
        avgScrollDepth: data.count > 0 ? Math.round(data.scroll / data.count) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 20),
    browserBreakdown: Object.entries(browserMap)
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    osBreakdown: Object.entries(osMap)
      .map(([os, count]) => ({ os, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  }
}

/**
 * Get page views over time (for line chart)
 */
export async function getPageViewsOverTime(startDate: Date, endDate: Date) {
  const snap = await db.collection('pageViews')
    .where('createdAt', '>=', startDate)
    .where('createdAt', '<=', endDate)
    .orderBy('createdAt', 'asc')
    .get()

  const views = docsToArray(snap) as any[]
  const grouped: Record<string, number> = {}
  for (const v of views) {
    const d = v.createdAt instanceof Date ? v.createdAt : new Date(v.createdAt)
    const day = d.toISOString().split('T')[0]
    grouped[day] = (grouped[day] || 0) + 1
  }

  return Object.entries(grouped).map(([date, count]) => ({ date, count }))
}

/**
 * Get hourly traffic distribution
 */
export async function getHourlyTraffic(startDate: Date, endDate: Date) {
  const snap = await db.collection('pageViews')
    .where('createdAt', '>=', startDate)
    .where('createdAt', '<=', endDate)
    .get()

  const views = docsToArray(snap) as any[]
  const hourly = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }))
  for (const v of views) {
    const d = v.createdAt instanceof Date ? v.createdAt : new Date(v.createdAt)
    hourly[d.getHours()].count++
  }

  return hourly
}

/**
 * Get recent sessions
 */
export async function getRecentSessions(limit: number = 50) {
  const snap = await db.collection('pageViews')
    .orderBy('createdAt', 'desc')
    .limit(limit * 3)
    .get()

  const sessions = docsToArray(snap) as any[]

  const sessionMap = new Map<string, any[]>()
  for (const view of sessions) {
    if (!sessionMap.has(view.sessionId)) sessionMap.set(view.sessionId, [])
    sessionMap.get(view.sessionId)!.push(view)
  }

  return Array.from(sessionMap.entries())
    .slice(0, limit)
    .map(([sessionId, views]) => ({
      sessionId,
      pagesVisited: views.length,
      pages: views.map((v: any) => v.path),
      device: views[0].device,
      browser: views[0].browser,
      os: views[0].os,
      totalDuration: views.reduce((sum: number, v: any) => sum + (v.duration || 0), 0),
      startedAt: views[views.length - 1].createdAt,
    }))
}

/**
 * Get top referrers
 */
export async function getTopReferrers(startDate: Date, endDate: Date, limit: number = 10) {
  const snap = await db.collection('pageViews')
    .where('createdAt', '>=', startDate)
    .where('createdAt', '<=', endDate)
    .get()

  const views = docsToArray(snap) as any[]
  const refMap: Record<string, number> = {}
  for (const v of views) {
    if (v.referrer) {
      refMap[v.referrer] = (refMap[v.referrer] || 0) + 1
    }
  }

  return Object.entries(refMap)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

/**
 * Get event counts by name
 */
export async function getEventCounts(startDate: Date, endDate: Date) {
  const snap = await db.collection('analyticsEvents')
    .where('createdAt', '>=', startDate)
    .where('createdAt', '<=', endDate)
    .get()

  const events = docsToArray(snap) as any[]
  const countMap: Record<string, number> = {}
  for (const e of events) {
    countMap[e.eventName] = (countMap[e.eventName] || 0) + 1
  }

  return Object.entries(countMap)
    .map(([eventName, count]) => ({ eventName, _count: count }))
    .sort((a, b) => b._count - a._count)
}
