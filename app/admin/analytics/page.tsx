'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Users, Eye, Clock, MousePointer, Globe, Monitor, Smartphone } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const COLORS = ['#e4002b', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

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

  const devicePieData = data?.overview.deviceBreakdown.map((d) => ({
    name: d.device || 'unknown',
    value: d._count.id,
  })) || []

  const browserPieData = data?.overview.browserBreakdown.map((b) => ({
    name: b.browser || 'unknown',
    value: b._count.id,
  })) || []

  const topPagesBarData = data?.overview.topPages.slice(0, 8).map((p) => ({
    path: p.path.length > 20 ? p.path.slice(0, 20) + '…' : p.path,
    fullPath: p.path,
    views: p._count.id,
  })) || []

  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const entry = data?.hourlyTraffic.find((h) => h.hour === hour)
    return { hour: `${hour}:00`, views: entry?.count || 0 }
  })

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
              <Card className="animate-fade-in-up delay-100">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-gray-500">Page Views</span>
                  </div>
                  <p className="text-2xl font-bold">{(data.overview.totalPageViews ?? 0).toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="animate-fade-in-up delay-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500">Unique Sessions</span>
                  </div>
                  <p className="text-2xl font-bold">{(data.overview.uniqueSessions ?? 0).toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="animate-fade-in-up delay-300">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-gray-500">Avg. Duration</span>
                  </div>
                  <p className="text-2xl font-bold">{formatDuration(data.overview.avgDuration ?? 0)}</p>
                </CardContent>
              </Card>
              <Card className="animate-fade-in-up delay-400">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MousePointer className="h-4 w-4 text-orange-500" />
                    <span className="text-xs text-gray-500">Avg. Scroll Depth</span>
                  </div>
                  <p className="text-2xl font-bold">{Math.round(data.overview.avgScrollDepth ?? 0)}%</p>
                </CardContent>
              </Card>
            </div>

            {/* Page Views Over Time — Line Chart */}
            <Card className="animate-fade-in-up delay-500">
              <CardHeader>
                <CardTitle className="text-base">Page Views Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {data.viewsOverTime.length === 0 ? (
                  <p className="text-sm text-gray-500">No data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={data.viewsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" name="Views" stroke="#e4002b" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Breakdown — Pie Chart */}
              <Card className="animate-fade-in-up delay-600">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Monitor className="h-4 w-4" /> Visitors by Device
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {devicePieData.length === 0 ? (
                    <p className="text-sm text-gray-500">No data yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={devicePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                          {devicePieData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Browser Breakdown — Pie Chart */}
              <Card className="animate-fade-in-up delay-600">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Visitors by Browser
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {browserPieData.length === 0 ? (
                    <p className="text-sm text-gray-500">No data yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={browserPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                          {browserPieData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Top Pages — Horizontal Bar Chart */}
              <Card className="animate-fade-in-up delay-700">
                <CardHeader>
                  <CardTitle className="text-base">Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  {topPagesBarData.length === 0 ? (
                    <p className="text-sm text-gray-500">No data yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={Math.max(200, topPagesBarData.length * 36)}>
                      <BarChart data={topPagesBarData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                        <YAxis dataKey="path" type="category" tick={{ fontSize: 11 }} width={120} />
                        <Tooltip formatter={(value: any) => [value, 'Views']} labelFormatter={(label: any) => {
                          const item = topPagesBarData.find((p) => p.path === String(label))
                          return item?.fullPath || String(label)
                        }} />
                        <Bar dataKey="views" fill="#e4002b" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Hourly Traffic — Bar Chart */}
              <Card className="animate-fade-in-up delay-700">
                <CardHeader>
                  <CardTitle className="text-base">Hourly Traffic</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="views" name="Views" fill="#e4002b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Custom Events */}
              <Card className="animate-fade-in-up delay-800">
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

              {/* Top Referrers */}
              <Card className="animate-fade-in-up delay-800">
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
            </div>

            {/* Recent Sessions */}
            <Card className="animate-fade-in-up delay-1000">
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
