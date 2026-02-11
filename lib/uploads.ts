import { db, generateId, toPlainObject, docsToArray } from './db'
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

  const ext = path.extname(file.name)
  const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '_')
  const uniqueName = `${baseName}-${Date.now()}${ext}`
  const filePath = path.join(UPLOAD_DIR, uniqueName)

  await writeFile(filePath, buffer)

  const url = `/uploads/${uniqueName}`
  const id = generateId()
  const doc = {
    filename: file.name,
    mimeType: file.type,
    size: file.size,
    url,
    uploadedBy: uploadedBy || null,
    createdAt: new Date(),
  }
  await db.collection('uploads').doc(id).set(doc)

  return { id, url, filename: file.name }
}

/**
 * List all uploads
 */
export async function listUploads(options?: { mimeType?: string }) {
  const snap = await db.collection('uploads').orderBy('createdAt', 'desc').get()
  let uploads = docsToArray(snap) as any[]

  if (options?.mimeType) {
    uploads = uploads.filter((u) => u.mimeType?.startsWith(options.mimeType!))
  }

  return uploads
}

/**
 * Delete an upload (file + DB record)
 */
export async function deleteUpload(id: string) {
  const doc = await db.collection('uploads').doc(id).get()
  if (!doc.exists) throw new Error('Upload not found')
  const upload = toPlainObject<any>(doc)!

  const filePath = path.join(process.cwd(), 'public', upload.url)
  try {
    await unlink(filePath)
  } catch {
    // File may already be deleted
  }

  await db.collection('uploads').doc(id).delete()
  return upload
}

/**
 * Get upload by ID
 */
export async function getUploadById(id: string) {
  const doc = await db.collection('uploads').doc(id).get()
  return toPlainObject(doc)
}
