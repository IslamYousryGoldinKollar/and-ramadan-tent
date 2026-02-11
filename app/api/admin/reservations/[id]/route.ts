import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db, toPlainObject, docsToArray } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'

const VALID_STATUSES = ['CONFIRMED', 'PENDING', 'CANCELLED', 'RESCHEDULED', 'CHECKED_IN']

/**
 * Admin-only endpoint to lookup reservation by serial number
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const snap = await db.collection('reservations')
      .where('serialNumber', '==', params.id)
      .limit(1)
      .get()

    if (snap.empty) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
    }

    const reservation = toPlainObject<any>(snap.docs[0])!

    // Enrich with user data
    let user = null
    if (reservation.userId) {
      const userDoc = await db.collection('users').doc(reservation.userId).get()
      if (userDoc.exists) {
        const u = toPlainObject(userDoc)!
        user = { id: (u as any).id, fullName: (u as any).fullName, employeeId: (u as any).employeeId, email: (u as any).email, department: (u as any).department }
      }
    }

    // Get recent audit logs
    const logsSnap = await db.collection('auditLogs')
      .where('reservationId', '==', reservation.id)
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get()

    return NextResponse.json({
      ...reservation,
      user,
      auditLogs: docsToArray(logsSnap),
    })
  } catch (error) {
    console.error('Error fetching reservation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Admin-only endpoint to update reservation status (e.g., check-in)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Find by serial number
    const snap = await db.collection('reservations')
      .where('serialNumber', '==', params.id)
      .limit(1)
      .get()

    if (snap.empty) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
    }

    const resDoc = snap.docs[0]
    await resDoc.ref.update({ status, updatedAt: new Date() })

    const updated = toPlainObject<any>(await resDoc.ref.get())!

    // Enrich with user
    let user = null
    if (updated.userId) {
      const userDoc = await db.collection('users').doc(updated.userId).get()
      if (userDoc.exists) {
        const u = toPlainObject(userDoc)!
        user = { id: (u as any).id, fullName: (u as any).fullName, employeeId: (u as any).employeeId, email: (u as any).email, department: (u as any).department }
      }
    }

    await createAuditLog(
      session.user.id,
      updated.id,
      status === 'CHECKED_IN' ? 'CHECKED_IN' : 'MODIFIED',
      { status }
    )

    return NextResponse.json({ ...updated, user })
  } catch (error) {
    console.error('Error updating reservation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
