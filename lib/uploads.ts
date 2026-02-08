import { prisma } from './prisma'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

/**
 * Ensure upload directory exists
 */
async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true })
}

/**
 * Save an uploaded file and create a DB record
 */
export async function saveUpload(
  file: File,
  uploadedBy?: string
): Promise<{ id: string; url: string; filename: string }> {
  await ensureUploadDir()

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Generate unique filename
  const ext = path.extname(file.name)
  const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '_')
  const uniqueName = `${baseName}-${Date.now()}${ext}`
  const filePath = path.join(UPLOAD_DIR, uniqueName)

  await writeFile(filePath, buffer)

  const url = `/uploads/${uniqueName}`

  const upload = await prisma.upload.create({
    data: {
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      url,
      uploadedBy,
    },
  })

  return { id: upload.id, url: upload.url, filename: upload.filename }
}

/**
 * List all uploads
 */
export async function listUploads(options?: { mimeType?: string }) {
  const where: any = {}
  if (options?.mimeType) {
    where.mimeType = { startsWith: options.mimeType }
  }

  return prisma.upload.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Delete an upload (file + DB record)
 */
export async function deleteUpload(id: string) {
  const upload = await prisma.upload.findUnique({ where: { id } })
  if (!upload) throw new Error('Upload not found')

  // Delete file from disk
  const filePath = path.join(process.cwd(), 'public', upload.url)
  try {
    await unlink(filePath)
  } catch {
    // File may already be deleted
  }

  return prisma.upload.delete({ where: { id } })
}

/**
 * Get upload by ID
 */
export async function getUploadById(id: string) {
  return prisma.upload.findUnique({ where: { id } })
}
