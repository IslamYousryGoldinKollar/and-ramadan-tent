import { randomUUID } from 'crypto'
import { db, generateId, toPlainObject, docsToArray } from './db'
import { calculatePriorityScore } from './priority'
import { sendWaitingListNotification } from './notifications'
import { MAX_CAPACITY } from './utils'
import { checkAvailability } from './reservations'

export type WaitingListStatus = 'PENDING' | 'NOTIFIED' | 'CONFIRMED' | 'EXPIRED' | 'CANCELLED'

/**
 * Automatically fill vacated slots from waiting list
 */
export async function fillVacatedSlots(reservationDate: Date, availableSeats: number) {
  if (availableSeats <= 0) return

  const startOfDay = new Date(reservationDate)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(reservationDate)
  endOfDay.setHours(23, 59, 59, 999)

  const snapshot = await db.collection('waitingList')
    .where('targetDate', '>=', startOfDay)
    .where('targetDate', '<=', endOfDay)
    .where('status', '==', 'PENDING')
    .orderBy('targetDate')
    .get()

  const entries = docsToArray(snapshot)
  // Sort by priorityScore desc, then createdAt asc
  entries.sort((a: any, b: any) => {
    if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  let remainingSeats = availableSeats

  for (const entry of entries as any[]) {
    if (remainingSeats <= 0) break

    if (entry.requestedSeats <= remainingSeats) {
      const notificationDeadline = new Date()
      notificationDeadline.setHours(notificationDeadline.getHours() + 2)
      const confirmationToken = randomUUID()

      await db.collection('waitingList').doc(entry.id).update({
        status: 'NOTIFIED',
        isNotified: true,
        notificationSentAt: new Date(),
        confirmationDeadline: notificationDeadline,
        confirmationToken,
        updatedAt: new Date(),
      })

      // Get user email
      const userDoc = await db.collection('users').doc(entry.userId).get()
      const user = toPlainObject(userDoc)

      if (user) {
        await sendWaitingListNotification((user as any).email, {
          reservationDate: entry.targetDate,
          seatCount: entry.requestedSeats,
          confirmationLink: `${process.env.APP_URL}/waiting-list/confirm/${entry.id}?token=${confirmationToken}`,
          deadline: notificationDeadline,
        })
      }

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

  const id = generateId()
  const now = new Date()
  const data = {
    userId,
    targetDate,
    requestedSeats,
    priorityScore: priority.score,
    status: 'PENDING' as WaitingListStatus,
    isNotified: false,
    notificationSentAt: null,
    confirmationDeadline: null,
    confirmationToken: null,
    createdAt: now,
    updatedAt: now,
  }

  await db.collection('waitingList').doc(id).set(data)

  const userDoc = await db.collection('users').doc(userId).get()
  const user = toPlainObject(userDoc)

  return { id, ...data, user }
}

/**
 * Confirm waiting list entry and create reservation
 */
export async function confirmWaitingListEntry(waitingListId: string) {
  const doc = await db.collection('waitingList').doc(waitingListId).get()
  if (!doc.exists) throw new Error('Waiting list entry not found')

  const entry = toPlainObject<any>(doc)!

  if (entry.status !== 'NOTIFIED') {
    throw new Error('Waiting list entry is not in notified state')
  }

  if (entry.confirmationDeadline && new Date() > new Date(entry.confirmationDeadline)) {
    await db.collection('waitingList').doc(waitingListId).update({
      status: 'EXPIRED',
      updatedAt: new Date(),
    })
    await fillVacatedSlots(entry.targetDate, entry.requestedSeats)
    throw new Error('Confirmation deadline has passed')
  }

  // Check current availability
  const availability = await checkAvailability(entry.targetDate)
  if (availability.availableSeats < entry.requestedSeats) {
    throw new Error('Not enough seats available')
  }

  await db.collection('waitingList').doc(waitingListId).update({
    status: 'CONFIRMED',
    updatedAt: new Date(),
  })

  // Enrich with user
  const userDoc = await db.collection('users').doc(entry.userId).get()
  const user = toPlainObject(userDoc)

  return { ...entry, user }
}
