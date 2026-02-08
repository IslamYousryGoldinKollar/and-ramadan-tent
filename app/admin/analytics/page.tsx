'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Users, Eye, Clock, MousePointer, Globe, Monitor, Smartphone } from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalPageViews: number
    uniqueSessions: number
    avgDuration: number
    avgScrollDepth: number
    topPages: Array<{ path: string; _count: { id: number } }>
    deviceBreakdown: Array<{ device: string; _count: { id: number } }>
    browserBreakdown: Array<{ browser: string; _count: { id: number } }>
  }
  viewsOverTime: Array<{ date: string; count: number }>
  hourlyTraffic: Array<{ hour: number; count: number }>
  recentSessions: Array<{
    sessionId: string
    path: string
    device: string | null
    browser: string | null
    os: string | null
    duration: number
    createdAt: string
  }>
  topReferrers: Array<{ referrer: string; _count: { id: number } }>
  eventCounts: Array<{ eventName: string; _count: { id: number } }>
  dateRange: { start: string; end: string }
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [range])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`)
      if (res.ok) setData(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${mins}m ${secs}s`
  }

  const ranges = [
    { value: '24h', label: '24h' },
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Track user engagement and traffic</p>
          </div>
          <div className="flex gap-1">
            {ranges.map((r) => (
              <Button
                key={r.value}
                variant={range === r.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRange(r.value)}
              >
                {r.label}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eand-red" />
          </div>
        ) : !data ? (
          <div className="text-center py-12 text-gray-500">No analytics data available.</div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-gray-500">Page Views</span>
                  </div>
                  <p className="text-2xl font-bold">{data.overview.totalPageViews.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500">Unique Sessions</span>
                  </div>
                  <p className="text-2xl font-bold">{data.overview.uniqueSessions.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-gray-500">Avg. Duration</span>
                  </div>
                  <p className="text-2xl font-bold">{formatDuration(data.overview.avgDuration)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MousePointer className="h-4 w-4 text-orange-500" />
                    <span className="text-xs text-gray-500">Avg. Scroll Depth</span>
                  </div>
                  <p className="text-2xl font-bold">{Math.round(data.overview.avgScrollDepth)}%</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.overview.topPages.length === 0 ? (
                    <p className="text-sm text-gray-500">No data yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {data.overview.topPages.map((page, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm font-mono truncate flex-1">{page.path}</span>
                          <span className="text-sm font-semibold ml-2">{page._count.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Custom Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.eventCounts.length === 0 ? (
                    <p className="text-sm text-gray-500">No events tracked yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {data.eventCounts.map((event, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm">{event.eventName}</span>
                          <span className="text-sm font-semibold">{event._count.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Monitor className="h-4 w-4" /> Device Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.overview.deviceBreakdown.length === 0 ? (
                    <p className="text-sm text-gray-500">No data yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {data.overview.deviceBreakdown.map((d, i) => {
                        const total = data.overview.totalPageViews || 1
                        const pct = Math.round((d._count.id / total) * 100)
                        return (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm flex items-center gap-1">
                                {d.device === 'mobile' ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                                {d.device || 'unknown'}
                              </span>
                              <span className="text-sm font-semibold">{pct}% ({d._count.id})</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div className="bg-eand-red rounded-full h-2" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Browser Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Browser Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.overview.browserBreakdown.length === 0 ? (
                    <p className="text-sm text-gray-500">No data yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {data.overview.browserBreakdown.map((b, i) => {
                        const total = data.overview.totalPageViews || 1
                        const pct = Math.round((b._count.id / total) * 100)
                        return (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">{b.browser || 'unknown'}</span>
                              <span className="text-sm font-semibold">{pct}% ({b._count.id})</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div className="bg-blue-500 rounded-full h-2" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Referrers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Referrers</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.topReferrers.length === 0 ? (
                    <p className="text-sm text-gray-500">No referrer data.</p>
                  ) : (
                    <div className="space-y-3">
                      {data.topReferrers.map((ref, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm truncate flex-1">{ref.referrer || 'Direct'}</span>
                          <span className="text-sm font-semibold ml-2">{ref._count.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Hourly Traffic */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Hourly Traffic</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.hourlyTraffic.length === 0 ? (
                    <p className="text-sm text-gray-500">No data yet.</p>
                  ) : (
                    <div className="flex items-end gap-0.5 h-32">
                      {Array.from({ length: 24 }, (_, hour) => {
                        const entry = data.hourlyTraffic.find(h => h.hour === hour)
                        const count = entry?.count || 0
                        const max = Math.max(...data.hourlyTraffic.map(h => h.count), 1)
                        const height = (count / max) * 100
                        return (
                          <div
                            key={hour}
                            className="flex-1 bg-eand-red/80 rounded-t hover:bg-eand-red transition-colors relative group"
                            style={{ height: `${Math.max(height, 2)}%` }}
                            title={`${hour}:00 - ${count} views`}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                              {hour}:00 ({count})
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 font-medium">Page</th>
                        <th className="pb-2 font-medium">Device</th>
                        <th className="pb-2 font-medium">Browser</th>
                        <th className="pb-2 font-medium">Duration</th>
                        <th className="pb-2 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentSessions.slice(0, 20).map((session, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2 font-mono text-xs">{session.path}</td>
                          <td className="py-2">{session.device || '-'}</td>
                          <td className="py-2">{session.browser || '-'}</td>
                          <td className="py-2">{formatDuration(session.duration)}</td>
                          <td className="py-2 text-gray-500">{new Date(session.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
