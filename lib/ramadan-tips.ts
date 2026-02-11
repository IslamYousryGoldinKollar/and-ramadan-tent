import { db, generateId, toPlainObject, docsToArray } from './db'

export const ARTICLE_CATEGORIES = [
  'Health',
  'Nutrition',
  'Spiritual',
  'Lifestyle',
  'Fitness',
  'General',
] as const

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]

export interface CreateArticleData {
  title: string
  excerpt?: string
  htmlContent: string
  category: string
  imageUrl?: string
  videoUrl?: string
  displayOrder?: number
}

export interface UpdateArticleData {
  title?: string
  excerpt?: string
  htmlContent?: string
  category?: string
  imageUrl?: string | null
  videoUrl?: string | null
  displayOrder?: number
  isActive?: boolean
}

/**
 * Create a new Ramadan article
 */
export async function createArticle(data: CreateArticleData) {
  const id = generateId()
  const now = new Date()
  const doc = {
    title: data.title,
    excerpt: data.excerpt || null,
    htmlContent: data.htmlContent,
    category: data.category || 'General',
    imageUrl: data.imageUrl || null,
    videoUrl: data.videoUrl || null,
    displayOrder: data.displayOrder ?? 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }
  await db.collection('ramadanArticles').doc(id).set(doc)
  return { id, ...doc }
}

/**
 * Update an article
 */
export async function updateArticle(id: string, data: UpdateArticleData) {
  await db.collection('ramadanArticles').doc(id).update({ ...data, updatedAt: new Date() })
  const doc = await db.collection('ramadanArticles').doc(id).get()
  return toPlainObject(doc)
}

/**
 * Delete an article
 */
export async function deleteArticle(id: string) {
  await db.collection('ramadanArticles').doc(id).delete()
}

/**
 * Toggle article active status
 */
export async function toggleArticleStatus(id: string) {
  const doc = await db.collection('ramadanArticles').doc(id).get()
  if (!doc.exists) throw new Error('Article not found')
  const article = toPlainObject<any>(doc)!
  await db.collection('ramadanArticles').doc(id).update({ isActive: !article.isActive, updatedAt: new Date() })
  return { ...article, isActive: !article.isActive }
}

/**
 * Get active articles (public)
 */
export async function getActiveArticles(category?: string) {
  let query: FirebaseFirestore.Query = db.collection('ramadanArticles')
    .where('isActive', '==', true)

  if (category) {
    query = query.where('category', '==', category)
  }

  const snap = await query.orderBy('displayOrder', 'asc').get()
  return docsToArray(snap)
}

/**
 * Get all articles (admin)
 */
export async function getAllArticles(options?: {
  category?: string
  search?: string
  isActive?: boolean
}) {
  let query: FirebaseFirestore.Query = db.collection('ramadanArticles')

  if (options?.category) {
    query = query.where('category', '==', options.category)
  }
  if (options?.isActive !== undefined) {
    query = query.where('isActive', '==', options.isActive)
  }

  const snap = await query.orderBy('displayOrder', 'asc').get()
  let articles = docsToArray(snap) as any[]

  // Client-side text search (Firestore doesn't support full-text search)
  if (options?.search) {
    const search = options.search.toLowerCase()
    articles = articles.filter(
      (a) =>
        a.title?.toLowerCase().includes(search) ||
        a.excerpt?.toLowerCase().includes(search)
    )
  }

  return articles
}

/**
 * Get article by ID
 */
export async function getArticleById(id: string) {
  const doc = await db.collection('ramadanArticles').doc(id).get()
  return toPlainObject(doc)
}

/**
 * Batch reorder articles
 */
export async function reorderArticles(items: { id: string; displayOrder: number }[]) {
  const batch = db.batch()
  for (const item of items) {
    batch.update(db.collection('ramadanArticles').doc(item.id), {
      displayOrder: item.displayOrder,
      updatedAt: new Date(),
    })
  }
  await batch.commit()
}

/**
 * Get article stats
 */
export async function getArticleStats() {
  const snap = await db.collection('ramadanArticles').get()
  const articles = docsToArray(snap) as any[]
  const total = articles.length
  const active = articles.filter((a) => a.isActive).length

  const catMap: Record<string, number> = {}
  for (const a of articles) {
    const cat = a.category || 'General'
    catMap[cat] = (catMap[cat] || 0) + 1
  }

  return {
    total,
    active,
    inactive: total - active,
    byCategory: Object.entries(catMap).map(([category, count]) => ({ category, count })),
  }
}
