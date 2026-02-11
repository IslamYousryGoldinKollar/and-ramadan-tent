import { db, toPlainObject, docsToArray } from './db'

export enum PriorityTier {
  TIER_1 = 1, // High Priority: First-time users (0 bookings)
  TIER_2 = 2, // Medium Priority: Occasional users (1-2 bookings)
  TIER_3 = 3, // Low Priority: Frequent users (3+ bookings)
}

export interface PriorityScore {
  tier: PriorityTier
  score: number
  bookingCount: number
}

const ACTIVE_STATUSES = ['CONFIRMED', 'RESCHEDULED', 'CHECKED_IN']

/**
 * Calculate priority score based on booking history
 */
export async function calculatePriorityScore(userId: string): Promise<PriorityScore> {
  // Count confirmed bookings (exclude cancelled)
  let bookingCount = 0
  for (const status of ACTIVE_STATUSES) {
    const snap = await db.collection('reservations')
      .where('userId', '==', userId)
      .where('status', '==', status)
      .get()
    bookingCount += snap.size
  }

  let tier: PriorityTier
  let score: number

  if (bookingCount === 0) {
    tier = PriorityTier.TIER_1
    score = 100
  } else if (bookingCount <= 2) {
    tier = PriorityTier.TIER_2
    score = 50
  } else {
    tier = PriorityTier.TIER_3
    score = 10
  }

  return { tier, score, bookingCount }
}

/**
 * Get the highest priority user from waiting list for a specific date
 */
export async function getHighestPriorityWaitingListUser(targetDate: Date) {
  const startOfDay = new Date(targetDate)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(targetDate)
  endOfDay.setHours(23, 59, 59, 999)

  const snapshot = await db.collection('waitingList')
    .where('targetDate', '>=', startOfDay)
    .where('targetDate', '<=', endOfDay)
    .where('status', '==', 'PENDING')
    .orderBy('targetDate')
    .get()

  if (snapshot.empty) return null

  // Sort by priorityScore desc, then createdAt asc
  const entries = docsToArray(snapshot)
  entries.sort((a: any, b: any) => {
    if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  const entry = entries[0] as any

  // Enrich with user data
  const userDoc = await db.collection('users').doc(entry.userId).get()
  const user = toPlainObject(userDoc)

  return { ...entry, user }
}
