'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { LayoutDashboard, Calendar, Users, TrendingUp, Brain, Lightbulb, FileText, BarChart3, ClipboardList, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  totalReservations: number
  todayReservations: number
  totalSeatsBooked: number
  waitingListCount: number
}

export default function AdminDashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalReservations: 0,
    todayReservations: 0,
    totalSeatsBooked: 0,
    waitingListCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchStats()
  }, [session, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Overview of Ramadan Tent reservations and analytics
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eand-red"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="modern-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReservations}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today&apos;s Reservations</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayReservations}</div>
                <p className="text-xs text-muted-foreground">Confirmed for today</p>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Seats Booked</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSeatsBooked}</div>
                <p className="text-xs text-muted-foreground">Across all dates</p>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Waiting List</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.waitingListCount}</div>
                <p className="text-xs text-muted-foreground">Pending requests</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="modern-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <a href="/admin/reservations" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                <ClipboardList className="h-6 w-6 mb-2 text-eand-red group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold">Reservations</h3>
                <p className="text-sm text-gray-600">Manage bookings</p>
              </a>
              <a href="/admin/calendar" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                <Calendar className="h-6 w-6 mb-2 text-eand-red group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold">Calendar View</h3>
                <p className="text-sm text-gray-600">View all reservations</p>
              </a>
              <a href="/admin/checkin" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                <Settings className="h-6 w-6 mb-2 text-eand-red group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold">Check-in</h3>
                <p className="text-sm text-gray-600">Scan QR codes</p>
              </a>
              <a href="/admin/riddles" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                <Brain className="h-6 w-6 mb-2 text-eand-red group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold">Riddles</h3>
                <p className="text-sm text-gray-600">Episodes & raffles</p>
              </a>
              <a href="/admin/tips/daily" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                <Lightbulb className="h-6 w-6 mb-2 text-eand-red group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold">Daily Tips</h3>
                <p className="text-sm text-gray-600">Manage tips</p>
              </a>
              <a href="/admin/tips/articles" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                <FileText className="h-6 w-6 mb-2 text-eand-red group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold">Articles</h3>
                <p className="text-sm text-gray-600">Ramadan content</p>
              </a>
              <a href="/admin/analytics" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
                <BarChart3 className="h-6 w-6 mb-2 text-eand-red group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-gray-600">Traffic & engagement</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
