import { prisma } from './prisma'

export interface CreateWellnessContentData {
  title: string
  content: string
  pdfUrl?: string
  displayOrder?: number
}

/**
 * Create wellness content (now backed by RamadanArticle)
 */
export async function createWellnessContent(data: CreateWellnessContentData) {
  return prisma.ramadanArticle.create({
    data: {
      title: data.title,
      htmlContent: data.content,
      displayOrder: data.displayOrder || 0,
      isActive: true,
    },
  })
}

/**
 * Get all active wellness content
 */
export async function getActiveWellnessContent() {
  return prisma.ramadanArticle.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  })
}

/**
 * Get all wellness content (admin)
 */
export async function getAllWellnessContent() {
  return prisma.ramadanArticle.findMany({
    orderBy: { displayOrder: 'asc' },
  })
}

/**
 * Get wellness content by ID
 */
export async function getWellnessContentById(id: string) {
  return prisma.ramadanArticle.findUnique({
    where: { id },
  })
}

/**
 * Update wellness content
 */
export async function updateWellnessContent(
  id: string,
  data: Partial<CreateWellnessContentData>
) {
  const updateData: any = { ...data }
  if (data.content) {
    updateData.htmlContent = data.content
    delete updateData.content
  }
  delete updateData.pdfUrl
  return prisma.ramadanArticle.update({
    where: { id },
    data: updateData,
  })
}

/**
 * Delete wellness content
 */
export async function deleteWellnessContent(id: string) {
  return prisma.ramadanArticle.delete({
    where: { id },
  })
}

/**
 * Toggle wellness content active status
 */
export async function toggleWellnessContentStatus(id: string) {
  const content = await prisma.ramadanArticle.findUnique({
    where: { id },
  })

  if (!content) {
    throw new Error('Content not found')
  }

  return prisma.ramadanArticle.update({
    where: { id },
    data: {
      isActive: !content.isActive,
    },
  })
}
