import { db, generateId, toPlainObject, docsToArray } from './db'
import { getStorageBucket } from './firebase-admin'
import path from 'path'

const STORAGE_PREFIX = 'uploads'

/**
 * Save an uploaded file to Firebase Storage and create a DB record
 */
export async function saveUpload(
  file: File,
  uploadedBy?: string
): Promise<{ id: string; url: string; filename: string }> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = path.extname(file.name)
  const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '_')
  const uniqueName = `${baseName}-${Date.now()}${ext}`
  const storagePath = `${STORAGE_PREFIX}/${uniqueName}`

  const bucket = getStorageBucket()
  const storageFile = bucket.file(storagePath)

  // Save file; attempt public ACL but don't fail if uniform access is on
  try {
    await storageFile.save(buffer, {
      metadata: { contentType: file.type },
      public: true,
    })
  } catch {
    await storageFile.save(buffer, {
      metadata: { contentType: file.type },
    })
  }

  const url = `https://storage.googleapis.com/${bucket.name}/${storagePath}`
  const id = generateId()
  const doc = {
    filename: file.name,
    storagePath,
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
 * Delete an upload (Storage file + DB record)
 */
export async function deleteUpload(id: string) {
  const doc = await db.collection('uploads').doc(id).get()
  if (!doc.exists) throw new Error('Upload not found')
  const upload = toPlainObject<any>(doc)!

  if (upload.storagePath) {
    try {
      const bucket = getStorageBucket()
      await bucket.file(upload.storagePath).delete()
    } catch {
      // File may already be deleted from storage
    }
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
