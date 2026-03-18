'use client'

import { useEffect, useState, useCallback } from 'react'
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
  Trash2,
  FileText,
  Loader2,
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
  activities: 'Pre-Ramadan Activities',
  tent: 'Ramadan Tent',
  fawazeer: 'Ramadan Fawazeer',
  cooking: 'Cooking Show',
  branding: 'Branding & Atmosphere',
}

const STAR_LABELS = ['Disappointing', 'Below expectations', 'Acceptable', 'Loved it', 'Outstanding']

export default function SurveyReportPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<SurveyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [showResponses, setShowResponses] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchStats()
  }, [session, router])

  const fetchStats = async () => {
    try {
      setLoading(true)
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

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Delete ${selectedIds.size} response(s)? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch('/api/admin/survey', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      })
      if (res.ok) {
        setSelectedIds(new Set())
        await fetchStats()
      }
    } catch (e) {
      console.error('Delete failed:', e)
    } finally {
      setDeleting(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (!stats) return
    if (selectedIds.size === stats.recentResponses.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(stats.recentResponses.map((r: any) => r.id)))
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

  const generatePDF = useCallback(async () => {
    if (!stats || stats.total === 0) return
    setGeneratingPdf(true)

    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')

      const W = 1920
      const H = 1080
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [W, H] })

      const overallAvg = +(
        Object.values(stats.averages).reduce((a, b) => a + b, 0) /
        Object.values(stats.averages).filter((v) => v > 0).length
      ).toFixed(2)
      const bestEntry = Object.entries(stats.averages).sort((a, b) => b[1] - a[1])[0]
      const worstEntry = Object.entries(stats.averages).sort((a, b) => a[1] - b[1]).find(([, v]) => v > 0)

      const renderSlide = async (html: string) => {
        const container = document.createElement('div')
        container.style.cssText = `position:fixed;left:-9999px;top:0;width:${W}px;height:${H}px;overflow:hidden;`
        container.innerHTML = html
        document.body.appendChild(container)
        const canvas = await html2canvas(container, { width: W, height: H, scale: 1, useCORS: true, backgroundColor: '#18114B' })
        document.body.removeChild(container)
        return canvas
      }

      const slideStyle = `
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        width: ${W}px; height: ${H}px; background: linear-gradient(135deg, #18114B 0%, #0f0a30 50%, #18114B 100%);
        color: white; display: flex; flex-direction: column; box-sizing: border-box; overflow: hidden;
      `
      const goldColor = '#C9A84C'
      const redAccent = '#E4002B'

      // --- Slide 1: Title ---
      const slide1 = `<div style="${slideStyle}; align-items: center; justify-content: center; text-align: center;">
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;background:radial-gradient(circle,rgba(201,168,76,0.08),transparent 70%);border-radius:50%;"></div>
        <div style="font-size:18px;letter-spacing:8px;color:${goldColor};opacity:0.7;margin-bottom:40px;text-transform:uppercase;">e& Egypt</div>
        <div style="font-size:72px;font-weight:800;margin-bottom:16px;line-height:1.1;">Ramadan Experience 2026</div>
        <div style="font-size:36px;color:${goldColor};font-weight:600;margin-bottom:48px;">Survey Results Report</div>
        <div style="width:120px;height:2px;background:${goldColor};opacity:0.4;margin-bottom:48px;"></div>
        <div style="font-size:20px;color:rgba(255,255,255,0.4);">${stats.total} Responses &bull; ${Object.keys(stats.departments).length} Departments</div>
      </div>`
      const c1 = await renderSlide(slide1)
      pdf.addImage(c1.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, W, H)

      // --- Slide 2: Executive Summary ---
      pdf.addPage([W, H], 'landscape')
      const slide2 = `<div style="${slideStyle}; padding: 80px 100px;">
        <div style="font-size:14px;letter-spacing:4px;color:${goldColor};text-transform:uppercase;margin-bottom:12px;">Executive Summary</div>
        <div style="font-size:48px;font-weight:700;margin-bottom:48px;">Key Highlights</div>
        <div style="display:flex;gap:40px;margin-bottom:60px;">
          <div style="flex:1;background:rgba(255,255,255,0.05);border-radius:24px;padding:40px;border:1px solid rgba(255,255,255,0.08);">
            <div style="font-size:16px;color:rgba(255,255,255,0.5);margin-bottom:12px;">Total Responses</div>
            <div style="font-size:64px;font-weight:800;color:${goldColor};">${stats.total}</div>
            <div style="font-size:14px;color:rgba(255,255,255,0.4);margin-top:8px;">employees participated</div>
          </div>
          <div style="flex:1;background:rgba(255,255,255,0.05);border-radius:24px;padding:40px;border:1px solid rgba(255,255,255,0.08);">
            <div style="font-size:16px;color:rgba(255,255,255,0.5);margin-bottom:12px;">Overall Rating</div>
            <div style="font-size:64px;font-weight:800;">${overallAvg}<span style="font-size:28px;color:rgba(255,255,255,0.3);">/5</span></div>
            <div style="font-size:14px;color:rgba(255,255,255,0.4);margin-top:8px;">average across all categories</div>
          </div>
          <div style="flex:1;background:rgba(255,255,255,0.05);border-radius:24px;padding:40px;border:1px solid rgba(255,255,255,0.08);">
            <div style="font-size:16px;color:rgba(255,255,255,0.5);margin-bottom:12px;">Best Rated</div>
            <div style="font-size:64px;font-weight:800;color:#4ade80;">${bestEntry?.[1] || 0}<span style="font-size:28px;color:rgba(255,255,255,0.3);">/5</span></div>
            <div style="font-size:14px;color:rgba(255,255,255,0.4);margin-top:8px;">${bestEntry ? CATEGORY_LABELS[bestEntry[0]] : ''}</div>
          </div>
          <div style="flex:1;background:rgba(255,255,255,0.05);border-radius:24px;padding:40px;border:1px solid rgba(255,255,255,0.08);">
            <div style="font-size:16px;color:rgba(255,255,255,0.5);margin-bottom:12px;">Departments</div>
            <div style="font-size:64px;font-weight:800;">${Object.keys(stats.departments).length}</div>
            <div style="font-size:14px;color:rgba(255,255,255,0.4);margin-top:8px;">departments represented</div>
          </div>
        </div>
        <div style="background:rgba(201,168,76,0.1);border-radius:16px;padding:32px 40px;border-left:4px solid ${goldColor};">
          <div style="font-size:20px;font-weight:600;margin-bottom:8px;">Key Insight</div>
          <div style="font-size:16px;color:rgba(255,255,255,0.6);line-height:1.6;">With an overall rating of ${overallAvg}/5, the Ramadan Experience 2026 was well-received across the organization. ${bestEntry ? `"${CATEGORY_LABELS[bestEntry[0]]}" led the satisfaction scores at ${bestEntry[1]}/5.` : ''} ${worstEntry ? `"${CATEGORY_LABELS[worstEntry[0]]}" at ${worstEntry[1]}/5 presents the strongest opportunity for improvement.` : ''}</div>
        </div>
      </div>`
      const c2 = await renderSlide(slide2)
      pdf.addImage(c2.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, W, H)

      // --- Slide 3: Category Comparison ---
      pdf.addPage([W, H], 'landscape')
      const maxAvg = Math.max(...Object.values(stats.averages), 5)
      const catBars = Object.entries(stats.averages).map(([k, v]) => {
        const pct = (v / maxAvg) * 100
        const color = v >= 4.5 ? '#4ade80' : v >= 3.5 ? goldColor : v >= 2.5 ? '#facc15' : '#f87171'
        return `<div style="display:flex;align-items:center;gap:24px;margin-bottom:24px;">
          <div style="width:240px;text-align:right;font-size:18px;font-weight:600;">${CATEGORY_LABELS[k]}</div>
          <div style="flex:1;height:48px;background:rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;position:relative;">
            <div style="height:100%;width:${pct}%;background:${color};border-radius:12px;transition:all;"></div>
          </div>
          <div style="width:80px;font-size:28px;font-weight:800;">${v}</div>
        </div>`
      }).join('')
      const slide3 = `<div style="${slideStyle}; padding: 80px 100px;">
        <div style="font-size:14px;letter-spacing:4px;color:${goldColor};text-transform:uppercase;margin-bottom:12px;">Performance Overview</div>
        <div style="font-size:48px;font-weight:700;margin-bottom:56px;">Category Ratings Comparison</div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
          ${catBars}
        </div>
        <div style="font-size:14px;color:rgba(255,255,255,0.3);text-align:center;margin-top:24px;">Scale: 1 (Disappointing) to 5 (Outstanding)</div>
      </div>`
      const c3 = await renderSlide(slide3)
      pdf.addImage(c3.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, W, H)

      // --- Slide 4: Per-Category Distribution ---
      for (const [key, dist] of Object.entries(stats.distributions)) {
        pdf.addPage([W, H], 'landscape')
        const total = dist.reduce((a, b) => a + b, 0)
        const avg = stats.averages[key] || 0
        const distBars = dist.map((count, i) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          const barColor = i >= 3 ? '#4ade80' : i === 2 ? goldColor : '#f87171'
          return `<div style="display:flex;align-items:center;gap:20px;margin-bottom:20px;">
            <div style="width:60px;text-align:center;">
              <div style="font-size:28px;">${'★'.repeat(i + 1)}<span style="opacity:0.15;">${'★'.repeat(4 - i)}</span></div>
            </div>
            <div style="width:180px;text-align:right;font-size:15px;color:rgba(255,255,255,0.6);">${STAR_LABELS[i]}</div>
            <div style="flex:1;height:40px;background:rgba(255,255,255,0.06);border-radius:10px;overflow:hidden;">
              <div style="height:100%;width:${pct}%;background:${barColor};border-radius:10px;min-width:${count > 0 ? '4px' : '0'};"></div>
            </div>
            <div style="width:100px;font-size:18px;font-weight:700;">${count} <span style="font-size:14px;color:rgba(255,255,255,0.4);">(${pct}%)</span></div>
          </div>`
        }).join('')

        const topPct = total > 0 ? Math.round(((dist[3] + dist[4]) / total) * 100) : 0
        const slideN = `<div style="${slideStyle}; padding: 80px 100px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px;">
            <div>
              <div style="font-size:14px;letter-spacing:4px;color:${goldColor};text-transform:uppercase;margin-bottom:12px;">Detailed Breakdown</div>
              <div style="font-size:48px;font-weight:700;">${CATEGORY_LABELS[key]}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:72px;font-weight:800;">${avg}<span style="font-size:28px;color:rgba(255,255,255,0.3);">/5</span></div>
              <div style="font-size:16px;color:rgba(255,255,255,0.5);">${total} ratings</div>
            </div>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
            ${distBars}
          </div>
          <div style="background:rgba(201,168,76,0.1);border-radius:16px;padding:24px 32px;border-left:4px solid ${goldColor};margin-top:24px;">
            <div style="font-size:16px;color:rgba(255,255,255,0.6);line-height:1.5;">${topPct}% of respondents rated "${CATEGORY_LABELS[key]}" 4 or 5 stars, indicating ${topPct >= 70 ? 'strong overall satisfaction' : topPct >= 50 ? 'moderate satisfaction with room to grow' : 'an area that needs focused attention'}.</div>
          </div>
        </div>`
        const cn = await renderSlide(slideN)
        pdf.addImage(cn.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, W, H)
      }

      // --- Slide: Department Breakdown ---
      pdf.addPage([W, H], 'landscape')
      const deptEntries = Object.entries(stats.departments).sort((a, b) => b[1] - a[1]).slice(0, 12)
      const maxDept = deptEntries.length > 0 ? deptEntries[0][1] : 1
      const deptBars = deptEntries.map(([dept, count]) => {
        const pct = Math.round((count / maxDept) * 100)
        return `<div style="display:flex;align-items:center;gap:20px;margin-bottom:16px;">
          <div style="width:220px;text-align:right;font-size:16px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${dept}</div>
          <div style="flex:1;height:32px;background:rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,${redAccent},${goldColor});border-radius:8px;"></div>
          </div>
          <div style="width:60px;font-size:18px;font-weight:700;">${count}</div>
        </div>`
      }).join('')
      const slideDept = `<div style="${slideStyle}; padding: 80px 100px;">
        <div style="font-size:14px;letter-spacing:4px;color:${goldColor};text-transform:uppercase;margin-bottom:12px;">Participation</div>
        <div style="font-size:48px;font-weight:700;margin-bottom:48px;">Responses by Department</div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
          ${deptBars}
        </div>
      </div>`
      const cDept = await renderSlide(slideDept)
      pdf.addImage(cDept.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, W, H)

      // --- Slide: Closing ---
      pdf.addPage([W, H], 'landscape')
      const slideEnd = `<div style="${slideStyle}; align-items: center; justify-content: center; text-align: center;">
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:500px;background:radial-gradient(circle,rgba(201,168,76,0.06),transparent 70%);border-radius:50%;"></div>
        <div style="font-size:56px;font-weight:800;margin-bottom:24px;">Thank You</div>
        <div style="font-size:24px;color:${goldColor};margin-bottom:48px;">for making Ramadan 2026 special</div>
        <div style="width:120px;height:2px;background:${goldColor};opacity:0.3;margin-bottom:48px;"></div>
        <div style="font-size:18px;color:rgba(255,255,255,0.4);max-width:600px;line-height:1.7;">Your feedback directly shapes next year's Ramadan experience. Every rating and comment helps us create even more meaningful moments together.</div>
        <div style="margin-top:60px;font-size:14px;letter-spacing:6px;color:rgba(255,255,255,0.2);text-transform:uppercase;">e& Egypt &bull; People & Culture</div>
      </div>`
      const cEnd = await renderSlide(slideEnd)
      pdf.addImage(cEnd.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, W, H)

      pdf.save(`Ramadan-Survey-Report-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setGeneratingPdf(false)
    }
  }, [stats])

  if (session?.user?.role !== 'ADMIN') return null

  const overallAvg = stats
    ? +(
        Object.values(stats.averages).reduce((a, b) => a + b, 0) /
        (Object.values(stats.averages).filter((v) => v > 0).length || 1)
      ).toFixed(2)
    : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Survey Report
            </h1>
            <p className="text-gray-600 mt-1">
              Ramadan Experience 2026 survey analytics
            </p>
          </div>
          {stats && stats.total > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={generatePDF}
                disabled={generatingPdf}
                className="flex items-center gap-2 px-4 py-2 bg-eand-ocean text-white rounded-lg hover:bg-eand-ocean/90 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {generatingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {generatingPdf ? 'Generating...' : 'Export PDF Report'}
              </button>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-eand-red text-white rounded-lg hover:bg-eand-red/90 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
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
                                  <span className="text-xs text-gray-500 w-32 text-right truncate">{STAR_LABELS[i]}</span>
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

            {/* Recent responses with delete */}
            <Card className="modern-card">
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() => setShowResponses(!showResponses)}
                    className="flex items-center gap-2"
                  >
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      All Responses ({stats.recentResponses.length})
                    </CardTitle>
                    {showResponses ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showResponses && selectedIds.size > 0 && (
                    <button
                      onClick={deleteSelected}
                      disabled={deleting}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      Delete ({selectedIds.size})
                    </button>
                  )}
                </div>
              </CardHeader>
              {showResponses && (
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-2 pr-2 w-8">
                            <input
                              type="checkbox"
                              checked={selectedIds.size === stats.recentResponses.length && stats.recentResponses.length > 0}
                              onChange={toggleSelectAll}
                              className="rounded border-gray-300"
                            />
                          </th>
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
                            <tr key={r.id} className={`border-b last:border-0 hover:bg-gray-50 ${selectedIds.has(r.id) ? 'bg-red-50/50' : ''}`}>
                              <td className="py-2 pr-2">
                                <input
                                  type="checkbox"
                                  checked={selectedIds.has(r.id)}
                                  onChange={() => toggleSelect(r.id)}
                                  className="rounded border-gray-300"
                                />
                              </td>
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
