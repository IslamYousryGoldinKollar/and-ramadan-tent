import { db, generateId, toPlainObject, docsToArray, generateUniqueSerialNumber } from './db'
import { calculateCredits, MAX_CAPACITY } from './utils'
import { generateQRCode } from './qrcode'
import { fillVacatedSlots } from './waiting-list'
import { sendBookingConfirmation, sendModificationAlert, sendCancellationConfirmation } from './notifications'
import { sendBookingConfirmationSms } from './sms'
import { sendBookingConfirmationWhatsApp, sendCancellationWhatsApp, sendRescheduleWhatsApp } from './whatsapp'
import { createAuditLog } from './audit'

export type ReservationStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'RESCHEDULED' | 'CHECKED_IN'

const ACTIVE_STATUSES: ReservationStatus[] = ['CONFIRMED', 'RESCHEDULED', 'CHECKED_IN']

async function getActiveReservationsForDate(reservationDate: Date) {
  const startOfDay = new Date(reservationDate)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(reservationDate)
  endOfDay.setHours(23, 59, 59, 999)

  const snap = await db.collection('reservations')
    .where('status', 'in', ACTIVE_STATUSES)
    .where('reservationDate', '>=', startOfDay)
    .where('reservationDate', '<=', endOfDay)
    .get()
  return docsToArray(snap)
}

/**
 * Check availability for a specific date
 */
export async function checkAvailability(reservationDate: Date): Promise<{
  available: boolean
  availableSeats: number
  bookedSeats: number
}> {
  const existingReservations = await getActiveReservationsForDate(reservationDate)
  const bookedSeats = existingReservations.reduce((sum: number, r: any) => sum + r.seatCount, 0)
  const availableSeats = MAX_CAPACITY - bookedSeats

  return {
    available: availableSeats > 0,
    availableSeats: Math.max(0, availableSeats),
    bookedSeats,
  }
}

/**
 * Create a public reservation (no authentication required)
 */
export async function createPublicReservation(
  employeeId: string,
  employeeName: string,
  email: string,
  phoneNumber: string,
  reservationDate: Date,
  seatCount: number
) {
  if (seatCount < 1 || seatCount > MAX_CAPACITY) {
    throw new Error(`Seat count must be between 1 and ${MAX_CAPACITY}`)
  }

  // Pre-generate serial, QR, and ID outside the transaction
  const serialNumber = await generateUniqueSerialNumber()
  const qrCodeString = await generateQRCode(serialNumber)
  const creditsUsed = calculateCredits(seatCount)
  const id = generateId()
  const now = new Date()

  const reservation = {
    employeeId,
    employeeName,
    email: email.toLowerCase(),
    phoneNumber,
    reservationDate,
    seatCount,
    status: 'CONFIRMED' as ReservationStatus,
    serialNumber,
    qrCodeString,
    creditsUsed,
    userId: null,
    createdAt: now,
    updatedAt: now,
  }

  // Use a transaction to atomically check availability and write
  await db.runTransaction(async (tx) => {
    const startOfDay = new Date(reservationDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(reservationDate)
    endOfDay.setHours(23, 59, 59, 999)

    const snap = await tx.get(
      db.collection('reservations')
        .where('status', 'in', ACTIVE_STATUSES)
        .where('reservationDate', '>=', startOfDay)
        .where('reservationDate', '<=', endOfDay)
    )
    const bookedSeats = snap.docs.reduce((sum, d) => sum + (d.data().seatCount || 0), 0)
    const availableSeats = MAX_CAPACITY - bookedSeats

    if (availableSeats < seatCount) {
      throw new Error(`Only ${availableSeats} seats available`)
    }

    tx.set(db.collection('reservations').doc(id), reservation)
  })

  const result = { id, ...reservation }

  await sendBookingConfirmation(email, {
    serialNumber,
    reservationDate,
    seatCount,
    location: 'e& Egypt HQ Kattameya, L1',
  })

  if (phoneNumber) {
    await Promise.allSettled([
      sendBookingConfirmationSms(phoneNumber, serialNumber, reservationDate, seatCount),
      sendBookingConfirmationWhatsApp(phoneNumber, serialNumber, reservationDate, seatCount),
    ])
  }

  return result
}

/**
 * Create a new reservation
 */
export async function createReservation(
  userId: string,
  reservationDate: Date,
  seatCount: number
) {
  if (seatCount < 1 || seatCount > MAX_CAPACITY) {
    throw new Error(`Seat count must be between 1 and ${MAX_CAPACITY}`)
  }

  // Pre-generate serial, QR, and ID outside the transaction
  const serialNumber = await generateUniqueSerialNumber()
  const qrCodeString = await generateQRCode(serialNumber)
  const creditsUsed = calculateCredits(seatCount)
  const id = generateId()
  const now = new Date()

  const reservationData = {
    userId,
    reservationDate,
    seatCount,
    status: 'CONFIRMED' as ReservationStatus,
    serialNumber,
    qrCodeString,
    creditsUsed,
    employeeId: null,
    employeeName: null,
    email: null,
    phoneNumber: null,
    createdAt: now,
    updatedAt: now,
  }

  // Use a transaction to atomically check availability and write
  await db.runTransaction(async (tx) => {
    const startOfDay = new Date(reservationDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(reservationDate)
    endOfDay.setHours(23, 59, 59, 999)

    const snap = await tx.get(
      db.collection('reservations')
        .where('status', 'in', ACTIVE_STATUSES)
        .where('reservationDate', '>=', startOfDay)
        .where('reservationDate', '<=', endOfDay)
    )
    const bookedSeats = snap.docs.reduce((sum, d) => sum + (d.data().seatCount || 0), 0)
    const availableSeats = MAX_CAPACITY - bookedSeats

    if (availableSeats < seatCount) {
      throw new Error(`Only ${availableSeats} seats available`)
    }

    tx.set(db.collection('reservations').doc(id), reservationData)
  })

  // Get user for email
  const userDoc = await db.collection('users').doc(userId).get()
  const user = toPlainObject(userDoc)
  const reservation = { id, ...reservationData, user }

  await createAuditLog(userId, id, 'CREATED', { reservationDate, seatCount, serialNumber })

  const email = user?.email || reservationData.email
  if (email) {
    await sendBookingConfirmation(email, {
      serialNumber,
      reservationDate,
      seatCount,
      location: 'e& Egypt HQ Kattameya, L1',
    })
  }

  return reservation
}

/**
 * Cancel a reservation
 */
export async function cancelReservation(reservationId: string, userId: string) {
  const doc = await db.collection('reservations').doc(reservationId).get()
  if (!doc.exists) throw new Error('Reservation not found')

  const reservation = toPlainObject<any>(doc)!

  if (reservation.userId !== userId) throw new Error('Unauthorized')
  if (reservation.status === 'CANCELLED') throw new Error('Reservation already cancelled')

  await db.collection('reservations').doc(reservationId).update({
    status: 'CANCELLED',
    updatedAt: new Date(),
  })

  await createAuditLog(userId, reservationId, 'CANCELLED', {
    reservationDate: reservation.reservationDate,
    seatCount: reservation.seatCount,
  })

  // Get user for email
  let userEmail = reservation.email
  if (reservation.userId) {
    const userDoc = await db.collection('users').doc(reservation.userId).get()
    const user = toPlainObject(userDoc)
    if (user) userEmail = (user as any).email || userEmail
  }

  if (userEmail) {
    await sendCancellationConfirmation(userEmail, reservation.serialNumber)
  }
  if (reservation.phoneNumber) {
    await sendCancellationWhatsApp(reservation.phoneNumber, reservation.serialNumber)
  }

  await fillVacatedSlots(reservation.reservationDate, reservation.seatCount)
  return reservation
}

/**
 * Reschedule (move) a reservation to a new date
 */
export async function rescheduleReservation(
  reservationId: string,
  userId: string,
  newDate: Date
) {
  const doc = await db.collection('reservations').doc(reservationId).get()
  if (!doc.exists) throw new Error('Reservation not found')

  const reservation = toPlainObject<any>(doc)!

  if (reservation.userId !== userId) throw new Error('Unauthorized')
  if (reservation.status === 'CANCELLED') throw new Error('Cannot reschedule a cancelled reservation')

  const oldDate = reservation.reservationDate

  const availability = await checkAvailability(newDate)
  if (availability.availableSeats < reservation.seatCount) {
    throw new Error(`Only ${availability.availableSeats} seats available on the new date`)
  }

  const newSerialNumber = await generateUniqueSerialNumber()
  const newQrCodeString = await generateQRCode(newSerialNumber)

  await db.collection('reservations').doc(reservationId).update({
    reservationDate: newDate,
    status: 'RESCHEDULED',
    serialNumber: newSerialNumber,
    qrCodeString: newQrCodeString,
    updatedAt: new Date(),
  })

  await createAuditLog(userId, reservationId, 'MOVED', {
    oldDate,
    newDate,
    seatCount: reservation.seatCount,
    newSerialNumber,
  })

  // Get user for email
  let userEmail = reservation.email
  if (reservation.userId) {
    const userDoc = await db.collection('users').doc(reservation.userId).get()
    const user = toPlainObject(userDoc)
    if (user) userEmail = (user as any).email || userEmail
  }

  if (userEmail) {
    await sendModificationAlert(userEmail, { oldDate, newDate, serialNumber: newSerialNumber })
  }
  if (reservation.phoneNumber) {
    await sendRescheduleWhatsApp(reservation.phoneNumber, newSerialNumber, oldDate, newDate)
  }

  await fillVacatedSlots(oldDate, reservation.seatCount)

  const updatedDoc = await db.collection('reservations').doc(reservationId).get()
  return toPlainObject(updatedDoc)
}

/**
 * Get reservation by serial number
 */
export async function getReservationBySerial(serialNumber: string) {
  const snap = await db.collection('reservations')
    .where('serialNumber', '==', serialNumber)
    .limit(1)
    .get()

  if (snap.empty) return null
  return toPlainObject(snap.docs[0])
}

/**
 * Get all reservations for a user
 */
export async function getUserReservations(userId: string) {
  const snap = await db.collection('reservations')
    .where('userId', '==', userId)
    .orderBy('reservationDate', 'asc')
    .get()
  return docsToArray(snap)
}

/**
 * Check availability for a range of dates in a single query.
 */
export async function checkAvailabilityRange(
  startDate: Date,
  endDate: Date
): Promise<Record<string, { availableSeats: number; bookedSeats: number }>> {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  const snap = await db.collection('reservations')
    .where('status', 'in', ACTIVE_STATUSES)
    .where('reservationDate', '>=', start)
    .where('reservationDate', '<=', end)
    .get()
  const reservations = docsToArray(snap) as any[]

  const dailyBooked: Record<string, number> = {}
  for (const r of reservations) {
    const d = r.reservationDate instanceof Date ? r.reservationDate : new Date(r.reservationDate)
    const dateKey = d.toISOString().split('T')[0]
    dailyBooked[dateKey] = (dailyBooked[dateKey] || 0) + r.seatCount
  }

  const result: Record<string, { availableSeats: number; bookedSeats: number }> = {}
  const current = new Date(start)
  while (current <= end) {
    const dateKey = current.toISOString().split('T')[0]
    const booked = dailyBooked[dateKey] || 0
    result[dateKey] = {
      bookedSeats: booked,
      availableSeats: Math.max(0, MAX_CAPACITY - booked),
    }
    current.setDate(current.getDate() + 1)
  }

  return result
}

/**
 * Get reservations for a date range (for calendar view)
 */
export async function getReservationsForDateRange(startDate: Date, endDate: Date) {
  const snap = await db.collection('reservations')
    .where('status', 'in', ACTIVE_STATUSES)
    .where('reservationDate', '>=', startDate)
    .where('reservationDate', '<=', endDate)
    .get()
  const reservations = docsToArray(snap) as any[]

  // Enrich with user data
  const userIds = [...new Set(reservations.map((r) => r.userId).filter(Boolean))]
  const userMap: Record<string, any> = {}
  for (const uid of userIds) {
    const userDoc = await db.collection('users').doc(uid).get()
    if (userDoc.exists) {
      const u = toPlainObject(userDoc)!
      userMap[uid] = { id: u.id, fullName: (u as any).fullName, employeeId: (u as any).employeeId, department: (u as any).department }
    }
  }

  return reservations
    .map((r) => ({ ...r, user: r.userId ? userMap[r.userId] || null : null }))
    .sort((a, b) => new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime())
}
