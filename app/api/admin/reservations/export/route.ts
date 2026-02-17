import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db, docsToArray } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const dateFrom = searchParams.get('dateFrom') || ''
    const dateTo = searchParams.get('dateTo') || ''
    const search = searchParams.get('search') || ''

    // Fetch ALL reservations (no pagination)
    let query: FirebaseFirestore.Query = db.collection('reservations')

    const VALID_STATUSES = ['CONFIRMED', 'PENDING', 'CANCELLED', 'RESCHEDULED', 'CHECKED_IN']
    if (status && VALID_STATUSES.includes(status)) {
      query = query.where('status', '==', status)
    }

    const snap = await query.get()
    let reservations = docsToArray(snap) as any[]

    // Date range filter
    if (dateFrom) {
      const from = new Date(dateFrom)
      reservations = reservations.filter((r) => {
        const d = r.reservationDate instanceof Date ? r.reservationDate : new Date(r.reservationDate)
        return d >= from
      })
    }
    if (dateTo) {
      const end = new Date(dateTo)
      end.setHours(23, 59, 59, 999)
      reservations = reservations.filter((r) => {
        const d = r.reservationDate instanceof Date ? r.reservationDate : new Date(r.reservationDate)
        return d <= end
      })
    }

    // Search filter
    if (search) {
      const s = search.toLowerCase()
      reservations = reservations.filter((r) =>
        r.employeeName?.toLowerCase().includes(s) ||
        r.employeeId?.toLowerCase().includes(s) ||
        r.email?.toLowerCase().includes(s) ||
        r.serialNumber?.toLowerCase().includes(s) ||
        r.phoneNumber?.toLowerCase().includes(s)
      )
    }

    // Sort by reservation date descending
    reservations.sort((a, b) => {
      const aDate = a.reservationDate instanceof Date ? a.reservationDate : new Date(a.reservationDate)
      const bDate = b.reservationDate instanceof Date ? b.reservationDate : new Date(b.reservationDate)
      return bDate.getTime() - aDate.getTime()
    })

    // Build CSV
    const headers = [
      'Serial Number',
      'Reservation Date',
      'Employee Name',
      'Employee ID',
      'Email',
      'Phone Number',
      'Seats',
      'Status',
      'Credits Used',
      'Created At',
      'Updated At',
    ]

    const escapeCSV = (val: any) => {
      const str = val == null ? '' : String(val)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    const formatDate = (val: any) => {
      if (!val) return ''
      const d = val instanceof Date ? val : new Date(val)
      return isNaN(d.getTime()) ? '' : d.toISOString()
    }

    const rows = reservations.map((r) => [
      r.serialNumber || '',
      formatDate(r.reservationDate),
      r.employeeName || '',
      r.employeeId || '',
      r.email || '',
      r.phoneNumber || '',
      r.seatCount || 0,
      r.status || '',
      r.creditsUsed || 0,
      formatDate(r.createdAt),
      formatDate(r.updatedAt),
    ])

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\n')

    // Add BOM for Excel compatibility
    const bom = '\uFEFF'

    return new NextResponse(bom + csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="reservations-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting reservations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
