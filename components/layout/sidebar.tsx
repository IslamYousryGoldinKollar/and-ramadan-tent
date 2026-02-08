'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  Calendar,
  BookOpen,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Lightbulb,
  Brain,
  ClipboardList,
  FileText,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const employeeNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: BookOpen },
  { href: '/dashboard/manage', label: 'Manage Reservation', icon: Search },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
]

const adminNavItems = [
  { href: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
  { href: '/admin/reservations', label: 'Reservations', icon: ClipboardList },
  { href: '/admin/calendar', label: 'Calendar View', icon: Calendar },
  { href: '/admin/checkin', label: 'Check-in', icon: Settings },
  { href: '/admin/riddles', label: 'Riddles', icon: Brain },
  { href: '/admin/tips/daily', label: 'Daily Tips', icon: Lightbulb },
  { href: '/admin/tips/articles', label: 'Articles', icon: FileText },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  const navItems = isAdmin ? adminNavItems : employeeNavItems

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-eand-red">e&</div>
          <span className="text-sm text-gray-600">Ramadan Tent</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-eand-red text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4 px-4 py-2 text-sm">
          <div className="font-medium text-gray-900">{session?.user?.name}</div>
          <div className="text-gray-500 text-xs">{session?.user?.email}</div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
