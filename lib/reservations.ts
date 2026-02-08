import { prisma } from './prisma'
import { ReservationStatus } from '@prisma/client'
import { generateUniqueSerialNumber, calculateCredits } from './utils'
import { generateQRCode } from './qrcode'
import { fillVacatedSlots } from './waiting-list'
import { sendBookingConfirmation, sendModificationAlert, sendCancellationConfirmation } from './notifications'
import { sendBookingConfirmationSms } from './sms'
import { sendBookingConfirmationWhatsApp, sendCancellationWhatsApp, sendRescheduleWhatsApp } from './whatsapp'
import { createAuditLog } from './audit'

const MAX_CAPACITY = 120

/**
 * Check availability for a specific date
 */
export async function checkAvailability(reservationDate: Date): Promise<{
  available: boolean
  availableSeats: number
  bookedSeats: number
}> {
  const startOfDay = new Date(reservationDate)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(reservationDate)
  endOfDay.setHours(23, 59, 59, 999)

  const existingReservations = await prisma.reservation.findMany({
    where: {
      reservationDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        in: [ReservationStatus.CONFIRMED, ReservationStatus.RESCHEDULED, ReservationStatus.CHECKED_IN],
      },
    },
  })

  const bookedSeats = existingReservations.reduce((sum, r) => sum + r.seatCount, 0)
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
  // Validate seat count
  if (seatCount < 1 || seatCount > 10) {
    throw new Error('Seat count must be between 1 and 10')
  }

  // Check availability
  const availability = await checkAvailability(reservationDate)
  if (availability.availableSeats < seatCount) {
    throw new Error(`Only ${availability.availableSeats} seats available`)
  }

  // Generate unique serial number and QR code
  const serialNumber = await generateUniqueSerialNumber(prisma)
  const qrCodeString = await generateQRCode(serialNumber)
  const creditsUsed = calculateCredits(seatCount)

  // Create reservation without user relation
  const reservation = await prisma.reservation.create({
    data: {
      employeeId,
      employeeName,
      email: email.toLowerCase(),
      phoneNumber,
      reservationDate,
      seatCount,
      status: ReservationStatus.CONFIRMED,
      serialNumber,
      qrCodeString,
      creditsUsed,
    },
  })

  // Send confirmation email
  await sendBookingConfirmation(email, {
    serialNumber,
    reservationDate,
    seatCount,
    qrCodeUrl: qrCodeString,
    location: 'e& Egypt Corporate Ramadan Tent',
  })

  // Send confirmation SMS + WhatsApp
  if (phoneNumber) {
    await Promise.allSettled([
      sendBookingConfirmationSms(phoneNumber, serialNumber, reservationDate, seatCount),
      sendBookingConfirmationWhatsApp(phoneNumber, serialNumber, reservationDate, seatCount),
    ])
  }

  return reservation
}

/**
 * Create a new reservation
 */
export async function createReservation(
  userId: string,
  reservationDate: Date,
  seatCount: number
) {
  // Validate seat count
  if (seatCount < 1 || seatCount > 10) {
    throw new Error('Seat count must be between 1 and 10')
  }

  // Check availability
  const availability = await checkAvailability(reservationDate)
  if (availability.availableSeats < seatCount) {
    throw new Error(`Only ${availability.availableSeats} seats available`)
  }

  // Generate unique serial number and QR code
  const serialNumber = await generateUniqueSerialNumber(prisma)
  const qrCodeString = await generateQRCode(serialNumber)
  const creditsUsed = calculateCredits(seatCount)

  // Create reservation
  const reservation = await prisma.reservation.create({
    data: {
      userId,
      reservationDate,
      seatCount,
      status: ReservationStatus.CONFIRMED,
      serialNumber,
      qrCodeString,
      creditsUsed,
    },
    include: {
      user: true,
    },
  })

  // Create audit log
  await createAuditLog(userId, reservation.id, 'CREATED', {
    reservationDate,
    seatCount,
    serialNumber,
  })

  // Send confirmation email
  const email = reservation.user?.email || reservation.email
  if (email) {
    await sendBookingConfirmation(email, {
      serialNumber,
      reservationDate,
      seatCount,
      qrCodeUrl: qrCodeString,
      location: 'e& Egypt Corporate Ramadan Tent',
    })
  }

  return reservation
}

/**
 * Cancel a reservation
 */
export async function cancelReservation(reservationId: string, userId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { user: true },
  })

  if (!reservation) {
    throw new Error('Reservation not found')
  }

  if (reservation.userId !== userId) {
    throw new Error('Unauthorized')
  }

  if (reservation.status === ReservationStatus.CANCELLED) {
    throw new Error('Reservation already cancelled')
  }

  // Update reservation status
  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: ReservationStatus.CANCELLED },
  })

  // Create audit log
  await createAuditLog(userId, reservationId, 'CANCELLED', {
    reservationDate: reservation.reservationDate,
    seatCount: reservation.seatCount,
  })

  // Send cancellation email + WhatsApp
  const email = reservation.user?.email || reservation.email
  if (email) {
    await sendCancellationConfirmation(email, reservation.serialNumber)
  }
  if (reservation.phoneNumber) {
    await sendCancellationWhatsApp(reservation.phoneNumber, reservation.serialNumber)
  }

  // Trigger waiting list fill
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
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { user: true },
  })

  if (!reservation) {
    throw new Error('Reservation not found')
  }

  if (reservation.userId !== userId) {
    throw new Error('Unauthorized')
  }

  if (reservation.status === ReservationStatus.CANCELLED) {
    throw new Error('Cannot reschedule a cancelled reservation')
  }

  const oldDate = reservation.reservationDate

  // Check availability for new date
  const availability = await checkAvailability(newDate)
  if (availability.availableSeats < reservation.seatCount) {
    throw new Error(`Only ${availability.availableSeats} seats available on the new date`)
  }

  // Generate new unique serial number and QR code
  const newSerialNumber = await generateUniqueSerialNumber(prisma)
  const newQrCodeString = await generateQRCode(newSerialNumber)

  // Update reservation
  const updatedReservation = await prisma.reservation.update({
    where: { id: reservationId },
    data: {
      reservationDate: newDate,
      status: ReservationStatus.RESCHEDULED,
      serialNumber: newSerialNumber,
      qrCodeString: newQrCodeString,
    },
    include: {
      user: true,
    },
  })

  // Create audit log
  await createAuditLog(userId, reservationId, 'MOVED', {
    oldDate,
    newDate,
    seatCount: reservation.seatCount,
    newSerialNumber,
  })

  // Send modification email + WhatsApp
  const email = reservation.user?.email || reservation.email
  if (email) {
    await sendModificationAlert(email, {
      oldDate,
      newDate,
      serialNumber: newSerialNumber,
    })
  }
  if (reservation.phoneNumber) {
    await sendRescheduleWhatsApp(reservation.phoneNumber, newSerialNumber, oldDate, newDate)
  }

  // Trigger waiting list fill for old date
  await fillVacatedSlots(oldDate, reservation.seatCount)

  return updatedReservation
}

/**
 * Get reservation by serial number
 */
export async function getReservationBySerial(serialNumber: string) {
  return prisma.reservation.findUnique({
    where: { serialNumber },
    include: {
      user: true,
      auditLogs: {
        orderBy: { timestamp: 'desc' },
      },
    },
  })
}

/**
 * Get all reservations for a user
 */
export async function getUserReservations(userId: string) {
  return prisma.reservation.findMany({
    where: { userId },
    orderBy: { reservationDate: 'asc' },
  })
}

/**
 * Check availability for a range of dates in a single query.
 * Returns a map of date strings to availability data.
 */
export async function checkAvailabilityRange(
  startDate: Date,
  endDate: Date
): Promise<Record<string, { availableSeats: number; bookedSeats: number }>> {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  const reservations = await prisma.reservation.findMany({
    where: {
      reservationDate: { gte: start, lte: end },
      status: {
        in: [ReservationStatus.CONFIRMED, ReservationStatus.RESCHEDULED, ReservationStatus.CHECKED_IN],
      },
    },
    select: { reservationDate: true, seatCount: true },
  })

  // Aggregate booked seats per day
  const dailyBooked: Record<string, number> = {}
  for (const r of reservations) {
    const dateKey = r.reservationDate.toISOString().split('T')[0]
    dailyBooked[dateKey] = (dailyBooked[dateKey] || 0) + r.seatCount
  }

  // Build result for every day in range
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
  return prisma.reservation.findMany({
    where: {
      reservationDate: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        in: [ReservationStatus.CONFIRMED, ReservationStatus.RESCHEDULED, ReservationStatus.CHECKED_IN],
      },
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          employeeId: true,
          department: true,
        },
      },
    },
    orderBy: { reservationDate: 'asc' },
  })
}
