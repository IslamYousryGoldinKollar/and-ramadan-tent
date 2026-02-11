import { db, generateId, toPlainObject, docsToArray } from './db'

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
  const id = generateId()
  const now = new Date()
  const doc = {
    title: data.title,
    shortTip: data.shortTip,
    fullContent: data.fullContent,
    tipNumber: data.tipNumber,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }
  await db.collection('dailyTips').doc(id).set(doc)
  return { id, ...doc }
}

/**
 * Update a daily tip
 */
export async function updateDailyTip(id: string, data: UpdateDailyTipData) {
  await db.collection('dailyTips').doc(id).update({ ...data, updatedAt: new Date() })
  const doc = await db.collection('dailyTips').doc(id).get()
  return toPlainObject(doc)
}

/**
 * Delete a daily tip
 */
export async function deleteDailyTip(id: string) {
  await db.collection('dailyTips').doc(id).delete()
}

/**
 * Toggle daily tip active status
 */
export async function toggleDailyTipStatus(id: string) {
  const doc = await db.collection('dailyTips').doc(id).get()
  if (!doc.exists) throw new Error('Daily tip not found')
  const tip = toPlainObject<any>(doc)!
  await db.collection('dailyTips').doc(id).update({ isActive: !tip.isActive, updatedAt: new Date() })
  return { ...tip, isActive: !tip.isActive }
}

/**
 * Get all active daily tips ordered by tip number
 */
export async function getActiveDailyTips() {
  const snap = await db.collection('dailyTips')
    .where('isActive', '==', true)
    .orderBy('tipNumber', 'asc')
    .get()
  return docsToArray(snap)
}

/**
 * Get all daily tips (admin)
 */
export async function getAllDailyTips() {
  const snap = await db.collection('dailyTips').orderBy('tipNumber', 'asc').get()
  return docsToArray(snap)
}

/**
 * Get a single daily tip by ID
 */
export async function getDailyTipById(id: string) {
  const doc = await db.collection('dailyTips').doc(id).get()
  return toPlainObject(doc)
}

/**
 * Get daily tip stats
 */
export async function getDailyTipStats() {
  const allSnap = await db.collection('dailyTips').get()
  const total = allSnap.size
  const active = allSnap.docs.filter((d) => d.data().isActive === true).length
  return { total, active, inactive: total - active }
}
