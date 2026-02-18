// Simple in-memory rate limiter
// For production, consider Redis-backed rate limiting

import { createHash } from 'crypto'
import { db } from './db'

interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key)
    }
  }
}, 60_000) // Clean every minute

interface RateLimitOptions {
  windowMs?: number   // Time window in milliseconds (default: 60s)
  maxRequests?: number // Max requests per window (default: 10)
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetIn: number } {
  const { windowMs = 60_000, maxRequests = 10 } = options
  const now = Date.now()
  const entry = store.get(identifier)

  if (!entry || now > entry.resetTime) {
    store.set(identifier, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: maxRequests - 1, resetIn: windowMs }
  }

  entry.count++

  if (entry.count > maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    }
  }

  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  }
}

/**
 * Distributed Firestore-backed rate limiter.
 * Falls back to in-memory limiter on Firestore errors.
 */
export async function rateLimitDistributed(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<{ success: boolean; remaining: number; resetIn: number }> {
  const { windowMs = 60_000, maxRequests = 10 } = options
  const now = Date.now()
  const windowStart = now - (now % windowMs)
  const windowEnd = windowStart + windowMs
  const key = `${windowStart}:${identifier}`
  const docId = createHash('sha256').update(key).digest('hex')

  try {
    const docRef = db.collection('rateLimits').doc(docId)
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef)
      const currentCount = snap.exists ? (snap.data()?.count || 0) : 0
      const nextCount = currentCount + 1
      const success = nextCount <= maxRequests

      tx.set(
        docRef,
        {
          count: nextCount,
          windowStart: new Date(windowStart),
          windowEnd: new Date(windowEnd),
          // Keep records long enough for troubleshooting; optionally configure Firestore TTL on this field.
          expiresAt: new Date(windowEnd + 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
        { merge: true }
      )

      return {
        success,
        remaining: Math.max(0, maxRequests - nextCount),
        resetIn: Math.max(0, windowEnd - now),
      }
    })

    return result
  } catch {
    return rateLimit(identifier, options)
  }
}

/**
 * Extract client IP from Next.js request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || 'unknown'
}
