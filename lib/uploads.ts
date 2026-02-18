import { db, generateId, toPlainObject, docsToArray } from './db'
import { getStorageBucket } from './firebase-admin'
import path from 'path'

const STORAGE_PREFIX = 'uploads'
const STORAGE_BUCKET = 'kedup-9rc91.firebasestorage.app'
const SIGNED_URL_TTL_MS = 30 * 60 * 1000 // 30 minutes

/**
 * Build a public Firebase Storage download URL.
 * Format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encodedPath}?alt=media
 */
function buildStorageUrl(bucketName: string, storagePath: string): string {
  const encoded = encodeURIComponent(storagePath)
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media`
}

function isStoragePathInUploads(storagePath: string): boolean {
  return storagePath.startsWith(`${STORAGE_PREFIX}/`)
}

export function extractStoragePathFromUrl(url?: string | null): string | null {
  if (!url) return null

  const gsPrefix = `gs://${STORAGE_BUCKET}/`
  if (url.startsWith(gsPrefix)) {
    return url.slice(gsPrefix.length)
  }

  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'firebasestorage.googleapis.com') {
      const parts = parsed.pathname.split('/').filter(Boolean)
      const bucketIndex = parts.indexOf('b')
      const objectIndex = parts.indexOf('o')

      if (bucketIndex >= 0 && objectIndex >= 0) {
        const bucket = parts[bucketIndex + 1]
        if (bucket !== STORAGE_BUCKET) return null

        const encodedPath = parts.slice(objectIndex + 1).join('/')
        return decodeURIComponent(encodedPath)
      }
    }

    if (parsed.hostname === 'storage.googleapis.com') {
      const parts = parsed.pathname.split('/').filter(Boolean)
      if (parts[0] === STORAGE_BUCKET) {
        return decodeURIComponent(parts.slice(1).join('/'))
      }
    }
  } catch {
    return null
  }

  return null
}

async function getSignedReadUrl(storagePath: string, expiresInMs: number = SIGNED_URL_TTL_MS): Promise<string> {
  const bucket = getStorageBucket()
  const [signedUrl] = await bucket.file(storagePath).getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + expiresInMs,
  })
  return signedUrl
}

export async function getSignedMediaUrl(url?: string | null): Promise<string | null | undefined> {
  if (!url) return url

  const storagePath = extractStoragePathFromUrl(url)
  if (!storagePath || !isStoragePathInUploads(storagePath)) {
    return url
  }

  try {
    return await getSignedReadUrl(storagePath)
  } catch {
    return url
  }
}

/**
 * Save an uploaded file to Firebase Storage and create a DB record
 */
export async function saveUpload(
  file: File,
  uploadedBy?: string
): Promise<{ id: string; url: string; signedUrl: string; filename: string }> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = path.extname(file.name)
  const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '_')
  const uniqueName = `${baseName}-${Date.now()}${ext}`
  const storagePath = `${STORAGE_PREFIX}/${uniqueName}`

  const bucket = getStorageBucket()
  const storageFile = bucket.file(storagePath)

  await storageFile.save(buffer, {
    metadata: {
      contentType: file.type,
      cacheControl: 'private, max-age=0, no-store',
    },
  })

  const url = buildStorageUrl(bucket.name, storagePath)
  const signedUrl = await getSignedReadUrl(storagePath)
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

  return { id, url, signedUrl, filename: file.name }
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
