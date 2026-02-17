import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db, docsToArray } from '@/lib/db'

const ACTIVE_STATUSES = ['CONFIRMED', 'RESCHEDULED', 'CHECKED_IN']

/**
 * GET - Find duplicate reservations (same email or employeeId on the same day)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const snap = await db.collection('reservations').get()
    const all = docsToArray(snap) as any[]

    // Group by (normalizedEmail + date) and (employeeId + date)
    const emailDateMap: Record<string, any[]> = {}
    const empIdDateMap: Record<string, any[]> = {}

    for (const r of all) {
      const dateStr = r.reservationDate instanceof Date
        ? r.reservationDate.toISOString().split('T')[0]
        : new Date(r.reservationDate).toISOString().split('T')[0]

      if (r.email) {
        const key = `${r.email.toLowerCase()}|${dateStr}`
        if (!emailDateMap[key]) emailDateMap[key] = []
        emailDateMap[key].push(r)
      }

      if (r.employeeId) {
        const key = `${r.employeeId}|${dateStr}`
        if (!empIdDateMap[key]) empIdDateMap[key] = []
        empIdDateMap[key].push(r)
      }
    }

    // Collect duplicate groups (more than 1 reservation per key)
    const duplicateGroups: {
      key: string
      matchType: 'email' | 'employeeId'
      matchValue: string
      date: string
      reservations: any[]
    }[] = []

    const seenIds = new Set<string>()

    for (const [key, group] of Object.entries(emailDateMap)) {
      if (group.length > 1) {
        const [email, date] = key.split('|')
        duplicateGroups.push({
          key,
          matchType: 'email',
          matchValue: email,
          date,
          reservations: group.map((r) => ({
            id: r.id,
            serialNumber: r.serialNumber,
            employeeName: r.employeeName,
            employeeId: r.employeeId,
            email: r.email,
            phoneNumber: r.phoneNumber,
            seatCount: r.seatCount,
            status: r.status,
            reservationDate: r.reservationDate,
            createdAt: r.createdAt,
          })),
        })
        group.forEach((r) => seenIds.add(r.id))
      }
    }

    for (const [key, group] of Object.entries(empIdDateMap)) {
      if (group.length > 1) {
        const [empId, date] = key.split('|')
        // Skip if all these reservations were already captured by email match
        const newIds = group.filter((r) => !seenIds.has(r.id))
        if (newIds.length === 0 && group.every((r) => seenIds.has(r.id))) continue

        duplicateGroups.push({
          key,
          matchType: 'employeeId',
          matchValue: empId,
          date,
          reservations: group.map((r) => ({
            id: r.id,
            serialNumber: r.serialNumber,
            employeeName: r.employeeName,
            employeeId: r.employeeId,
            email: r.email,
            phoneNumber: r.phoneNumber,
            seatCount: r.seatCount,
            status: r.status,
            reservationDate: r.reservationDate,
            createdAt: r.createdAt,
          })),
        })
      }
    }

    // Sort groups by date
    duplicateGroups.sort((a, b) => a.date.localeCompare(b.date))

    const totalDuplicateReservations = duplicateGroups.reduce(
      (sum, g) => sum + g.reservations.length - 1, // -1 because one is the "original"
      0
    )

    return NextResponse.json({
      groups: duplicateGroups,
      totalGroups: duplicateGroups.length,
      totalDuplicateReservations,
    })
  } catch (error) {
    console.error('Error finding duplicates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE - Remove specific duplicate reservations (no email/notification sent)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No reservation IDs provided' }, { status: 400 })
    }

    // Delete in batches of 500
    let deleted = 0
    for (let i = 0; i < ids.length; i += 500) {
      const chunk = ids.slice(i, i + 500)
      const batch = db.batch()
      for (const id of chunk) {
        batch.delete(db.collection('reservations').doc(id))
      }
      await batch.commit()
      deleted += chunk.length
    }

    return NextResponse.json({ deleted })
  } catch (error) {
    console.error('Error deleting duplicates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
