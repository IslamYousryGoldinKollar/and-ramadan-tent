import { db, generateId, toPlainObject, docsToArray } from './db'
import { sanitizeHtml } from './html-sanitizer'

export interface CreateWellnessContentData {
  title: string
  content: string
  pdfUrl?: string
  displayOrder?: number
}

/**
 * Create wellness content (now backed by ramadanArticles collection)
 */
export async function createWellnessContent(data: CreateWellnessContentData) {
  const id = generateId()
  const now = new Date()
  const doc = {
    title: data.title,
    htmlContent: sanitizeHtml(data.content),
    displayOrder: data.displayOrder || 0,
    isActive: true,
    category: 'General',
    excerpt: null,
    imageUrl: null,
    videoUrl: null,
    createdAt: now,
    updatedAt: now,
  }
  await db.collection('ramadanArticles').doc(id).set(doc)
  return { id, ...doc }
}

/**
 * Get all active wellness content
 */
export async function getActiveWellnessContent() {
  const snap = await db.collection('ramadanArticles')
    .where('isActive', '==', true)
    .orderBy('displayOrder', 'asc')
    .get()
  return docsToArray(snap)
}

/**
 * Get all wellness content (admin)
 */
export async function getAllWellnessContent() {
  const snap = await db.collection('ramadanArticles').orderBy('displayOrder', 'asc').get()
  return docsToArray(snap)
}

/**
 * Get wellness content by ID
 */
export async function getWellnessContentById(id: string) {
  const doc = await db.collection('ramadanArticles').doc(id).get()
  return toPlainObject(doc)
}

/**
 * Update wellness content
 */
export async function updateWellnessContent(
  id: string,
  data: Partial<CreateWellnessContentData>
) {
  const updateData: any = { ...data, updatedAt: new Date() }
  if (data.content) {
    updateData.htmlContent = sanitizeHtml(data.content)
    delete updateData.content
  }
  delete updateData.pdfUrl
  await db.collection('ramadanArticles').doc(id).update(updateData)
  const doc = await db.collection('ramadanArticles').doc(id).get()
  return toPlainObject(doc)
}

/**
 * Delete wellness content
 */
export async function deleteWellnessContent(id: string) {
  await db.collection('ramadanArticles').doc(id).delete()
}

/**
 * Toggle wellness content active status
 */
export async function toggleWellnessContentStatus(id: string) {
  const doc = await db.collection('ramadanArticles').doc(id).get()
  if (!doc.exists) throw new Error('Content not found')
  const content = toPlainObject<any>(doc)!
  await db.collection('ramadanArticles').doc(id).update({
    isActive: !content.isActive,
    updatedAt: new Date(),
  })
  return { ...content, isActive: !content.isActive }
}
