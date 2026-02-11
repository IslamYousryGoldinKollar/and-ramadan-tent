import { db, generateId, toPlainObject, docsToArray } from './db'

export type AuditActionType = 'CREATED' | 'CANCELLED' | 'MOVED' | 'CHECKED_IN' | 'MODIFIED'

/**
 * Create an audit log entry
 */
export async function createAuditLog(
  userId: string,
  reservationId: string | null,
  actionType: AuditActionType,
  metadata?: Record<string, any>
) {
  const id = generateId()
  const data = {
    userId,
    reservationId,
    actionType,
    metadata: metadata ? JSON.stringify(metadata) : null,
    timestamp: new Date(),
  }
  await db.collection('auditLogs').doc(id).set(data)
  return { id, ...data }
}

/**
 * Get audit logs for a reservation
 */
export async function getReservationAuditLogs(reservationId: string) {
  const snapshot = await db.collection('auditLogs')
    .where('reservationId', '==', reservationId)
    .orderBy('timestamp', 'desc')
    .get()

  const logs = docsToArray(snapshot)

  // Enrich with user data
  const userIds = [...new Set(logs.map((l: any) => l.userId))]
  const userMap: Record<string, any> = {}
  for (const uid of userIds) {
    const userDoc = await db.collection('users').doc(uid).get()
    if (userDoc.exists) {
      const u = toPlainObject(userDoc)!
      userMap[uid] = { id: u.id, fullName: u.fullName, employeeId: u.employeeId }
    }
  }

  return logs.map((log: any) => ({
    ...log,
    user: userMap[log.userId] || null,
  }))
}

/**
 * Get all audit logs (admin only)
 */
export async function getAllAuditLogs(startDate?: Date, endDate?: Date) {
  let query: FirebaseFirestore.Query = db.collection('auditLogs')

  if (startDate && endDate) {
    query = query
      .where('timestamp', '>=', startDate)
      .where('timestamp', '<=', endDate)
  }

  const snapshot = await query.orderBy('timestamp', 'desc').limit(1000).get()
  const logs = docsToArray(snapshot)

  // Enrich with user and reservation data
  const userIds = [...new Set(logs.map((l: any) => l.userId))]
  const reservationIds = [...new Set(logs.map((l: any) => l.reservationId).filter(Boolean))]

  const userMap: Record<string, any> = {}
  for (const uid of userIds) {
    const userDoc = await db.collection('users').doc(uid).get()
    if (userDoc.exists) {
      const u = toPlainObject(userDoc)!
      userMap[uid] = { id: u.id, fullName: u.fullName, employeeId: u.employeeId }
    }
  }

  const reservationMap: Record<string, any> = {}
  for (const rid of reservationIds) {
    const resDoc = await db.collection('reservations').doc(rid).get()
    if (resDoc.exists) {
      const r = toPlainObject(resDoc)!
      reservationMap[rid] = { id: r.id, serialNumber: r.serialNumber, reservationDate: r.reservationDate }
    }
  }

  return logs.map((log: any) => ({
    ...log,
    user: userMap[log.userId] || null,
    reservation: log.reservationId ? reservationMap[log.reservationId] || null : null,
  }))
}
