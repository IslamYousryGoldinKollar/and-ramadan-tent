import { prisma } from './prisma'

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
  return prisma.ramadanArticle.create({
    data: {
      title: data.title,
      excerpt: data.excerpt,
      htmlContent: data.htmlContent,
      category: data.category || 'General',
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      displayOrder: data.displayOrder ?? 0,
      isActive: true,
    },
  })
}

/**
 * Update an article
 */
export async function updateArticle(id: string, data: UpdateArticleData) {
  return prisma.ramadanArticle.update({
    where: { id },
    data,
  })
}

/**
 * Delete an article
 */
export async function deleteArticle(id: string) {
  return prisma.ramadanArticle.delete({
    where: { id },
  })
}

/**
 * Toggle article active status
 */
export async function toggleArticleStatus(id: string) {
  const article = await prisma.ramadanArticle.findUnique({ where: { id } })
  if (!article) throw new Error('Article not found')
  return prisma.ramadanArticle.update({
    where: { id },
    data: { isActive: !article.isActive },
  })
}

/**
 * Get active articles (public)
 */
export async function getActiveArticles(category?: string) {
  return prisma.ramadanArticle.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
    },
    orderBy: { displayOrder: 'asc' },
  })
}

/**
 * Get all articles (admin)
 */
export async function getAllArticles(options?: {
  category?: string
  search?: string
  isActive?: boolean
}) {
  const where: any = {}
  if (options?.category) where.category = options.category
  if (options?.isActive !== undefined) where.isActive = options.isActive
  if (options?.search) {
    where.OR = [
      { title: { contains: options.search, mode: 'insensitive' } },
      { excerpt: { contains: options.search, mode: 'insensitive' } },
    ]
  }

  return prisma.ramadanArticle.findMany({
    where,
    orderBy: { displayOrder: 'asc' },
  })
}

/**
 * Get article by ID
 */
export async function getArticleById(id: string) {
  return prisma.ramadanArticle.findUnique({
    where: { id },
  })
}

/**
 * Batch reorder articles
 */
export async function reorderArticles(items: { id: string; displayOrder: number }[]) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.ramadanArticle.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder },
      })
    )
  )
}

/**
 * Get article stats
 */
export async function getArticleStats() {
  const [total, active, byCategory] = await Promise.all([
    prisma.ramadanArticle.count(),
    prisma.ramadanArticle.count({ where: { isActive: true } }),
    prisma.ramadanArticle.groupBy({
      by: ['category'],
      _count: true,
    }),
  ])

  return {
    total,
    active,
    inactive: total - active,
    byCategory: byCategory.map((g) => ({ category: g.category, count: g._count })),
  }
}
