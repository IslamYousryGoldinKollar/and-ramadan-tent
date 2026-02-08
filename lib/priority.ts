import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

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

/**
 * Calculate priority score based on booking history
 * @param userId - User ID to check history for
 * @returns Priority score object with tier, score, and booking count
 */
export async function calculatePriorityScore(userId: string): Promise<PriorityScore> {
  // Count confirmed bookings (exclude cancelled)
  const bookingCount = await prisma.reservation.count({
    where: {
      userId,
      status: {
        in: ['CONFIRMED', 'RESCHEDULED', 'CHECKED_IN'],
      },
    },
  })

  let tier: PriorityTier
  let score: number

  if (bookingCount === 0) {
    tier = PriorityTier.TIER_1
    score = 100 // Highest priority
  } else if (bookingCount <= 2) {
    tier = PriorityTier.TIER_2
    score = 50 // Medium priority
  } else {
    tier = PriorityTier.TIER_3
    score = 10 // Lowest priority
  }

  return {
    tier,
    score,
    bookingCount,
  }
}

/**
 * Get the highest priority user from waiting list for a specific date
 * @param targetDate - Date to find waiting list entries for
 * @returns Waiting list entry with highest priority, or null if none found
 */
export async function getHighestPriorityWaitingListUser(targetDate: Date) {
  const startOfDay = new Date(targetDate)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(targetDate)
  endOfDay.setHours(23, 59, 59, 999)

  const waitingListEntry = await prisma.waitingList.findFirst({
    where: {
      targetDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: 'PENDING',
    },
    orderBy: [
      { priorityScore: 'desc' }, // Higher score = higher priority
      { createdAt: 'asc' }, // Earlier signup = higher priority if same score
    ],
    include: {
      user: true,
    },
  })

  return waitingListEntry
}
