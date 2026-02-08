import { prisma } from './prisma'

export interface CreateWellnessContentData {
  title: string
  content: string
  pdfUrl?: string
  displayOrder?: number
}

/**
 * Create wellness content
 */
export async function createWellnessContent(data: CreateWellnessContentData) {
  return prisma.wellnessContent.create({
    data: {
      title: data.title,
      content: data.content,
      pdfUrl: data.pdfUrl,
      displayOrder: data.displayOrder || 0,
      isActive: true,
    },
  })
}

/**
 * Get all active wellness content
 */
export async function getActiveWellnessContent() {
  return prisma.wellnessContent.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  })
}

/**
 * Get all wellness content (admin)
 */
export async function getAllWellnessContent() {
  return prisma.wellnessContent.findMany({
    orderBy: { displayOrder: 'asc' },
  })
}

/**
 * Get wellness content by ID
 */
export async function getWellnessContentById(id: string) {
  return prisma.wellnessContent.findUnique({
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
  return prisma.wellnessContent.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })
}

/**
 * Delete wellness content
 */
export async function deleteWellnessContent(id: string) {
  return prisma.wellnessContent.delete({
    where: { id },
  })
}

/**
 * Toggle wellness content active status
 */
export async function toggleWellnessContentStatus(id: string) {
  const content = await prisma.wellnessContent.findUnique({
    where: { id },
  })

  if (!content) {
    throw new Error('Content not found')
  }

  return prisma.wellnessContent.update({
    where: { id },
    data: {
      isActive: !content.isActive,
    },
  })
}
