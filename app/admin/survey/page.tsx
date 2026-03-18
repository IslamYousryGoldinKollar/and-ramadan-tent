'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  BarChart3,
  Users,
  Star,
  TrendingUp,
  Calendar,
  Building2,
  Download,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface SurveyStats {
  total: number
  averages: Record<string, number>
  distributions: Record<string, number[]>
  departments: Record<string, number>
  dailyCounts: Record<string, number>
  recentResponses: any[]
}

const CATEGORY_LABELS: Record<string, string> = {
  activities: 'Ramadan Activities',
  tent: 'Ramadan Tent',
  fawazeer: 'Ramadan Fawazeer',
  cooking: 'Cooking Show',
  branding: 'Branding & Atmosphere',
}

const RATING_LABELS: Record<string, string[]> = {
  activities: ['It was nice', 'Enjoyed it', 'Really good', 'Loved it', 'Outstanding'],
  tent: ['Good', 'Great', 'Really great', 'Amazing', 'Incredible'],
  fawazeer: ['Watched a few', 'Enjoyed some', 'Really liked it', 'Loved it', 'Absolutely amazing'],
  cooking: ['Good start', 'Enjoyable', 'Really great', 'Loved it', 'Outstanding'],
  branding: ['Good start', 'Enjoyable', 'Really great', 'Loved it', 'Outstanding'],
}

export default function SurveyReportPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<SurveyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [showResponses, setShowResponses] = useState(false)

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchStats()
  }, [session, router])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/survey')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (e) {
      console.error('Failed to load survey stats:', e)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    if (!stats?.recentResponses) return
    const rows = stats.recentResponses.map((r: any) => {
      const d = r.responses || {}
      return [
        d.employeeId || '',
        d.department || '',
        d.activitiesRating || '',
        d.tentRating || '',
        d.fawazeerRating || '',
        d.cookingRating || '',
        d.brandingRating || '',
        r.createdAt || '',
      ].join(',')
    })
    const header = 'Employee ID,Department,Activities,Tent,Fawazeer,Cooking,Branding,Date'
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `survey-responses-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (session?.user?.role !== 'ADMIN') return null

  const overallAvg = stats
    ? +(
        Object.values(stats.averages).reduce((a, b) => a + b, 0) /
        Object.values(stats.averages).filter((v) => v > 0).length
      ).toFixed(2)
    : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Survey Report
            </h1>
            <p className="text-gray-600 mt-1">
              Ramadan Experience 2025 survey analytics
            </p>
          </div>
          {stats && stats.total > 0 && (
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-eand-red text-white rounded-lg hover:bg-eand-red/90 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eand-red" />
          </div>
        ) : !stats || stats.total === 0 ? (
          <Card className="modern-card">
            <CardContent className="py-12 text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No survey responses yet</p>
              <p className="text-gray-400 text-sm mt-1">Responses will appear here once employees start filling in the survey</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">employees participated</p>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {overallAvg}
                    <span className="text-base font-normal text-gray-400">/5</span>
                  </div>
                  <p className="text-xs text-muted-foreground">average across all categories</p>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Rated</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {(() => {
                    const best = Object.entries(stats.averages).sort((a, b) => b[1] - a[1])[0]
                    return best ? (
                      <>
                        <div className="text-3xl font-bold">{best[1]}<span className="text-base font-normal text-gray-400">/5</span></div>
                        <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[best[0]]}</p>
                      </>
                    ) : null
                  })()}
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Departments</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Object.keys(stats.departments).length}</div>
                  <p className="text-xs text-muted-foreground">departments represented</p>
                </CardContent>
              </Card>
            </div>

            {/* Category breakdown */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Category Ratings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(stats.averages).map(([key, avg]) => {
                  const dist = stats.distributions[key] || [0, 0, 0, 0, 0]
                  const total = dist.reduce((a, b) => a + b, 0)
                  const isExpanded = expandedCategory === key
                  const labels = RATING_LABELS[key] || ['1', '2', '3', '4', '5']

                  return (
                    <div key={key} className="border rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : key)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900">
                            {CATEGORY_LABELS[key]}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-eand-red rounded-full transition-all"
                                style={{ width: `${(avg / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-900 w-10 text-right">{avg}</span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                      </button>

                      {isExpanded && total > 0 && (
                        <div className="px-4 pb-4 pt-1 border-t bg-gray-50/50">
                          <div className="space-y-2">
                            {dist.map((count, i) => {
                              const pct = total > 0 ? Math.round((count / total) * 100) : 0
                              return (
                                <div key={i} className="flex items-center gap-3">
                                  <span className="text-xs text-gray-500 w-32 text-right truncate">{labels[i]}</span>
                                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-eand-red/80 rounded-full transition-all"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium text-gray-600 w-16 text-right">
                                    {count} ({pct}%)
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Department breakdown */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Responses by Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.departments)
                    .sort((a, b) => b[1] - a[1])
                    .map(([dept, count]) => {
                      const pct = Math.round((count / stats.total) * 100)
                      return (
                        <div key={dept} className="flex items-center gap-3">
                          <span className="text-sm text-gray-700 w-44 truncate">{dept}</span>
                          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600 w-20 text-right">
                            {count} ({pct}%)
                          </span>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Daily trend */}
            {Object.keys(stats.dailyCounts).length > 0 && (
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Daily Responses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-1 h-32">
                    {Object.entries(stats.dailyCounts)
                      .sort((a, b) => a[0].localeCompare(b[0]))
                      .slice(-14)
                      .map(([date, count]) => {
                        const maxCount = Math.max(...Object.values(stats.dailyCounts))
                        const heightPct = maxCount > 0 ? (count / maxCount) * 100 : 0
                        return (
                          <div
                            key={date}
                            className="flex-1 flex flex-col items-center gap-1 group relative"
                          >
                            <div className="absolute -top-6 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {date}: {count}
                            </div>
                            <div
                              className="w-full bg-eand-red/80 rounded-t-sm transition-all hover:bg-eand-red min-h-[2px]"
                              style={{ height: `${heightPct}%` }}
                            />
                            <span className="text-[8px] text-gray-400 -rotate-45 origin-top-left mt-1">
                              {date.slice(5)}
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent responses */}
            <Card className="modern-card">
              <CardHeader>
                <button
                  onClick={() => setShowResponses(!showResponses)}
                  className="flex items-center justify-between w-full"
                >
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Recent Responses ({stats.recentResponses.length})
                  </CardTitle>
                  {showResponses ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </CardHeader>
              {showResponses && (
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-2 pr-4 font-medium text-gray-500">Employee</th>
                          <th className="pb-2 pr-4 font-medium text-gray-500">Department</th>
                          <th className="pb-2 pr-2 font-medium text-gray-500 text-center">Act.</th>
                          <th className="pb-2 pr-2 font-medium text-gray-500 text-center">Tent</th>
                          <th className="pb-2 pr-2 font-medium text-gray-500 text-center">Faw.</th>
                          <th className="pb-2 pr-2 font-medium text-gray-500 text-center">Cook</th>
                          <th className="pb-2 pr-2 font-medium text-gray-500 text-center">Brand</th>
                          <th className="pb-2 font-medium text-gray-500">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentResponses.map((r: any) => {
                          const d = r.responses || {}
                          return (
                            <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                              <td className="py-2 pr-4 font-medium">{d.employeeId || '—'}</td>
                              <td className="py-2 pr-4 text-gray-600">{d.department || '—'}</td>
                              <td className="py-2 pr-2 text-center"><RatingBadge val={d.activitiesRating} /></td>
                              <td className="py-2 pr-2 text-center"><RatingBadge val={d.tentRating} /></td>
                              <td className="py-2 pr-2 text-center"><RatingBadge val={d.fawazeerRating} /></td>
                              <td className="py-2 pr-2 text-center"><RatingBadge val={d.cookingRating} /></td>
                              <td className="py-2 pr-2 text-center"><RatingBadge val={d.brandingRating} /></td>
                              <td className="py-2 text-gray-400 text-xs">{r.createdAt?.split('T')[0] || '—'}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              )}
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

function RatingBadge({ val }: { val?: number }) {
  if (!val) return <span className="text-gray-300">—</span>
  const colors = [
    'bg-gray-100 text-gray-600',
    'bg-yellow-100 text-yellow-700',
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-emerald-100 text-emerald-700',
  ]
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${colors[val - 1] || colors[0]}`}>
      {val}
    </span>
  )
}
