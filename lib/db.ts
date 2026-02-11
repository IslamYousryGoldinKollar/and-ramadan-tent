/**
 * Firestore database helpers.
 * Re-exports the admin Firestore instance and provides utility functions
 * that mirror common Prisma patterns for easier migration.
 */
import { db } from './firebase-admin'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

export { db, FieldValue, Timestamp }

/**
 * Generate a unique document ID (similar to cuid)
 */
export function generateId(): string {
  return db.collection('_').doc().id
}

/**
 * Convert Firestore Timestamps to JS Dates in a document
 */
export function toPlainObject<T = Record<string, any>>(
  doc: FirebaseFirestore.DocumentSnapshot
): (T & { id: string }) | null {
  if (!doc.exists) return null
  const data = doc.data()!
  const result: any = { id: doc.id }
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate()
    } else {
      result[key] = value
    }
  }
  return result as T & { id: string }
}

/**
 * Convert an array of query snapshot docs to plain objects
 */
export function docsToArray<T = Record<string, any>>(
  snapshot: FirebaseFirestore.QuerySnapshot
): (T & { id: string })[] {
  return snapshot.docs.map((doc) => toPlainObject<T>(doc)!).filter(Boolean)
}

/**
 * Get current server timestamp as Date
 */
export function serverNow(): Date {
  return new Date()
}

/**
 * Generate a unique serial number with DB collision check.
 * Server-only function.
 */
export async function generateUniqueSerialNumber(
  maxAttempts: number = 10
): Promise<string> {
  const { generateSerialNumber } = await import('./utils')
  for (let i = 0; i < maxAttempts; i++) {
    const serialNumber = generateSerialNumber()
    const snapshot = await db.collection('reservations')
      .where('serialNumber', '==', serialNumber)
      .limit(1)
      .get()
    if (snapshot.empty) {
      return serialNumber
    }
  }
  throw new Error('Failed to generate a unique serial number after multiple attempts')
}
