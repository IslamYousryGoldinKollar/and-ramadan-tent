'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { UAParser } from 'ua-parser-js'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = sessionStorage.getItem('analytics_session_id')
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem('analytics_session_id', id)
  }
  return id
}

function getDeviceInfo() {
  if (typeof window === 'undefined') return { device: 'unknown', browser: 'unknown', os: 'unknown' }
  const parser = new UAParser(navigator.userAgent)
  const result = parser.getResult()
  const deviceType = result.device.type || 'desktop'
  return {
    device: deviceType,
    browser: result.browser.name || 'unknown',
    os: result.os.name || 'unknown',
  }
}

export function PageTracker() {
  const pathname = usePathname()
  const pageViewIdRef = useRef<string | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const maxScrollRef = useRef<number>(0)

  const sendPageView = useCallback(async (path: string) => {
    try {
      const sessionId = getSessionId()
      if (!sessionId) return

      const { device, browser, os } = getDeviceInfo()

      const res = await fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          path,
          referrer: document.referrer || undefined,
          userAgent: navigator.userAgent,
          device,
          browser,
          os,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        pageViewIdRef.current = data.id
        startTimeRef.current = Date.now()
        maxScrollRef.current = 0
      }
    } catch {
      // Silently fail - analytics should never break the app
    }
  }, [])

  const updatePageView = useCallback(async () => {
    if (!pageViewIdRef.current) return

    const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
    if (duration < 1) return

    try {
      await fetch('/api/analytics/pageview', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: pageViewIdRef.current,
          duration,
          scrollDepth: maxScrollRef.current,
        }),
        keepalive: true,
      })
    } catch {
      // Silently fail
    }
  }, [])

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const scrollPercent = Math.round((scrollTop / docHeight) * 100)
        maxScrollRef.current = Math.max(maxScrollRef.current, scrollPercent)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track page changes
  useEffect(() => {
    // Update previous page view before sending new one
    if (pageViewIdRef.current) {
      updatePageView()
    }

    sendPageView(pathname)
  }, [pathname, sendPageView, updatePageView])

  // Update on page leave
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updatePageView()
      }
    }

    const handleBeforeUnload = () => {
      updatePageView()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [updatePageView])

  return null
}

// Helper to track custom events from any component
export async function trackAnalyticsEvent(eventName: string, eventData?: Record<string, any>) {
  try {
    const sessionId = getSessionId()
    if (!sessionId) return

    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        eventName,
        eventData,
        path: window.location.pathname,
      }),
    })
  } catch {
    // Silently fail
  }
}
