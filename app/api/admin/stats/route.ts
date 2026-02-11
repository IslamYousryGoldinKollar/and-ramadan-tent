import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db, docsToArray } from '@/lib/db'

const ACTIVE_STATUSES = ['CONFIRMED', 'RESCHEDULED', 'CHECKED_IN']

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const now = new Date()
    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)
    const endOfToday = new Date(now)
    endOfToday.setHours(23, 59, 59, 999)

    // Fetch all active reservations
    let allActive: any[] = []
    for (const status of ACTIVE_STATUSES) {
      const snap = await db.collection('reservations')
        .where('status', '==', status)
        .get()
      allActive.push(...docsToArray(snap))
    }

    const totalReservations = allActive.length
    const totalSeatsBooked = allActive.reduce((sum: number, r: any) => sum + (r.seatCount || 0), 0)

    // Today's reservations
    const todayReservations = allActive.filter((r: any) => {
      const d = r.reservationDate instanceof Date ? r.reservationDate : new Date(r.reservationDate)
      return d >= startOfToday && d <= endOfToday
    }).length

    // Pending waiting list
    const waitingSnap = await db.collection('waitingList')
      .where('status', '==', 'PENDING')
      .get()

    return NextResponse.json({
      totalReservations,
      todayReservations,
      totalSeatsBooked,
      waitingListCount: waitingSnap.size,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
