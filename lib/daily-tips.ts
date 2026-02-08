import { prisma } from './prisma'

export interface CreateDailyTipData {
  title: string
  shortTip: string
  fullContent: string
  tipNumber: number
}

export interface UpdateDailyTipData {
  title?: string
  shortTip?: string
  fullContent?: string
  tipNumber?: number
  isActive?: boolean
}

/**
 * Create a new daily tip
 */
export async function createDailyTip(data: CreateDailyTipData) {
  return prisma.dailyTip.create({
    data: {
      title: data.title,
      shortTip: data.shortTip,
      fullContent: data.fullContent,
      tipNumber: data.tipNumber,
      isActive: true,
    },
  })
}

/**
 * Update a daily tip
 */
export async function updateDailyTip(id: string, data: UpdateDailyTipData) {
  return prisma.dailyTip.update({
    where: { id },
    data,
  })
}

/**
 * Delete a daily tip
 */
export async function deleteDailyTip(id: string) {
  return prisma.dailyTip.delete({
    where: { id },
  })
}

/**
 * Toggle daily tip active status
 */
export async function toggleDailyTipStatus(id: string) {
  const tip = await prisma.dailyTip.findUnique({ where: { id } })
  if (!tip) throw new Error('Daily tip not found')
  return prisma.dailyTip.update({
    where: { id },
    data: { isActive: !tip.isActive },
  })
}

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

/**
 * Get daily tip stats
 */
export async function getDailyTipStats() {
  const [total, active] = await Promise.all([
    prisma.dailyTip.count(),
    prisma.dailyTip.count({ where: { isActive: true } }),
  ])
  return { total, active, inactive: total - active }
}
