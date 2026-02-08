import { prisma } from './prisma'

/**
 * Get all active daily tips ordered by tip number
 */
export async function getActiveDailyTips() {
  return prisma.dailyTip.findMany({
    where: { isActive: true },
    orderBy: { tipNumber: 'asc' },
  })
}

/**
 * Get all daily tips (admin)
 */
export async function getAllDailyTips() {
  return prisma.dailyTip.findMany({
    orderBy: { tipNumber: 'asc' },
  })
}

/**
 * Get a single daily tip by ID
 */
export async function getDailyTipById(id: string) {
  return prisma.dailyTip.findUnique({
    where: { id },
  })
}
