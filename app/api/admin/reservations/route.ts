import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db, toPlainObject, docsToArray } from '@/lib/db'

const VALID_STATUSES = ['CONFIRMED', 'PENDING', 'CANCELLED', 'RESCHEDULED', 'CHECKED_IN']

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const dateFrom = searchParams.get('dateFrom') || ''
    const dateTo = searchParams.get('dateTo') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortDir = (searchParams.get('sortDir') || 'desc') as 'asc' | 'desc'

    // Build query - Firestore has limited compound queries so we filter in code
    let query: FirebaseFirestore.Query = db.collection('reservations')

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

    // Search filter (client-side)
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

    const total = reservations.length

    // Sort
    const validSortFields = ['createdAt', 'reservationDate', 'employeeName', 'seatCount', 'status', 'serialNumber']
    const field = validSortFields.includes(sortBy) ? sortBy : 'createdAt'
    reservations.sort((a, b) => {
      const aVal = a[field] ?? ''
      const bVal = b[field] ?? ''
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    // Paginate
    const paginated = reservations.slice((page - 1) * limit, page * limit)

    // Enrich with user data
    const userIds = [...new Set(paginated.map((r) => r.userId).filter(Boolean))]
    const userMap: Record<string, any> = {}
    for (const uid of userIds) {
      const userDoc = await db.collection('users').doc(uid).get()
      if (userDoc.exists) {
        const u = toPlainObject(userDoc)!
        userMap[uid] = { fullName: (u as any).fullName, department: (u as any).department }
      }
    }

    const enriched = paginated.map((r) => ({
      ...r,
      user: r.userId ? userMap[r.userId] || null : null,
    }))

    return NextResponse.json({
      reservations: enriched,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - bulk delete or clear all
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { ids, clearAll } = body

    if (clearAll) {
      const snap = await db.collection('reservations').get()
      // Firestore batch limit is 500 operations
      const chunks: FirebaseFirestore.DocumentReference[][] = []
      for (let i = 0; i < snap.docs.length; i += 500) {
        chunks.push(snap.docs.slice(i, i + 500).map((d) => d.ref))
      }
      for (const chunk of chunks) {
        const batch = db.batch()
        chunk.forEach((ref) => batch.delete(ref))
        await batch.commit()
      }
      return NextResponse.json({ deleted: snap.size })
    }

    if (ids && Array.isArray(ids) && ids.length > 0) {
      const batch = db.batch()
      for (const id of ids) {
        batch.delete(db.collection('reservations').doc(id))
      }
      await batch.commit()
      return NextResponse.json({ deleted: ids.length })
    }

    return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
  } catch (error) {
    console.error('Error deleting reservations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
