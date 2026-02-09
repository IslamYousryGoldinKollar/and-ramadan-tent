import { randomUUID } from 'crypto'
import { prisma } from './prisma'
import { calculatePriorityScore, getHighestPriorityWaitingListUser } from './priority'
import { ReservationStatus, WaitingListStatus } from '@prisma/client'
import { sendWaitingListNotification } from './notifications'
import { MAX_CAPACITY } from './utils'

/**
 * Automatically fill vacated slots from waiting list
 * Triggered when a reservation is cancelled or moved
 */
export async function fillVacatedSlots(reservationDate: Date, availableSeats: number) {
  if (availableSeats <= 0) return

  const startOfDay = new Date(reservationDate)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(reservationDate)
  endOfDay.setHours(23, 59, 59, 999)

  // Get all pending waiting list entries for this date, ordered by priority
  const waitingListEntries = await prisma.waitingList.findMany({
    where: {
      targetDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: WaitingListStatus.PENDING,
    },
    orderBy: [
      { priorityScore: 'desc' },
      { createdAt: 'asc' },
    ],
    include: {
      user: true,
    },
  })

  let remainingSeats = availableSeats

  for (const entry of waitingListEntries) {
    if (remainingSeats <= 0) break

    // Check if user's requested seats fit
    if (entry.requestedSeats <= remainingSeats) {
      // Notify the user
      const notificationDeadline = new Date()
      notificationDeadline.setHours(notificationDeadline.getHours() + 2) // 2 hours from now
      const confirmationToken = randomUUID()

      await prisma.waitingList.update({
        where: { id: entry.id },
        data: {
          status: WaitingListStatus.NOTIFIED,
          isNotified: true,
          notificationSentAt: new Date(),
          confirmationDeadline: notificationDeadline,
          confirmationToken,
        },
      })

      // Send notification email with token-protected link
      await sendWaitingListNotification(entry.user.email, {
        reservationDate: entry.targetDate,
        seatCount: entry.requestedSeats,
        confirmationLink: `${process.env.APP_URL}/waiting-list/confirm/${entry.id}?token=${confirmationToken}`,
        deadline: notificationDeadline,
      })

      remainingSeats -= entry.requestedSeats
    }
  }
}

/**
 * Add user to waiting list with automatic priority calculation
 */
export async function addToWaitingList(
  userId: string,
  targetDate: Date,
  requestedSeats: number
) {
  const priority = await calculatePriorityScore(userId)

  const waitingListEntry = await prisma.waitingList.create({
    data: {
      userId,
      targetDate,
      requestedSeats,
      priorityScore: priority.score,
      status: WaitingListStatus.PENDING,
    },
    include: {
      user: true,
    },
  })

  return waitingListEntry
}

/**
 * Confirm waiting list entry and create reservation
 */
export async function confirmWaitingListEntry(waitingListId: string) {
  const entry = await prisma.waitingList.findUnique({
    where: { id: waitingListId },
    include: { user: true },
  })

  if (!entry) {
    throw new Error('Waiting list entry not found')
  }

  if (entry.status !== WaitingListStatus.NOTIFIED) {
    throw new Error('Waiting list entry is not in notified state')
  }

  if (entry.confirmationDeadline && new Date() > entry.confirmationDeadline) {
    // Expired - update status and try next user
    await prisma.waitingList.update({
      where: { id: waitingListId },
      data: { status: WaitingListStatus.EXPIRED },
    })

    // Try to fill with next priority user
    await fillVacatedSlots(entry.targetDate, entry.requestedSeats)
    throw new Error('Confirmation deadline has passed')
  }

  // Check current availability
  const startOfDay = new Date(entry.targetDate)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(entry.targetDate)
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

  if (availableSeats < entry.requestedSeats) {
    throw new Error('Not enough seats available')
  }

  // Create reservation (this will be handled by the reservation creation logic)
  // Update waiting list status
  await prisma.waitingList.update({
    where: { id: waitingListId },
    data: { status: WaitingListStatus.CONFIRMED },
  })

  return entry
}
