/**
 * Session Refresh Strategy
 * Automatically refreshes Supabase sessions to prevent expiration
 * during long-running dashboard sessions
 */

import { createClient } from '@/lib/supabase/client'

/**
 * Session refresh configuration
 */
const SESSION_CONFIG = {
  /** Check session every 5 minutes */
  CHECK_INTERVAL_MS: 5 * 60 * 1000,

  /** Refresh if session expires in less than 10 minutes */
  REFRESH_THRESHOLD_MS: 10 * 60 * 1000,
} as const

let refreshTimer: NodeJS.Timeout | null = null

/**
 * Start automatic session refresh
 * Call this in client-side layout components
 */
export function startSessionRefresh() {
  // Prevent multiple timers
  if (refreshTimer) {
    return
  }

  const checkAndRefresh = async () => {
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        stopSessionRefresh()
        return
      }

      // Check if session is about to expire
      const expiresAt = new Date(session.expires_at || 0).getTime()
      const now = Date.now()
      const timeUntilExpiry = expiresAt - now

      if (timeUntilExpiry < SESSION_CONFIG.REFRESH_THRESHOLD_MS) {
        console.log('[Session] Refreshing session (expires in', Math.round(timeUntilExpiry / 1000), 'seconds)')

        const { error } = await supabase.auth.refreshSession()

        if (error) {
          console.error('[Session] Failed to refresh:', error)
          stopSessionRefresh()
        } else {
          console.log('[Session] Successfully refreshed')
        }
      }
    } catch (error) {
      console.error('[Session] Error checking session:', error)
    }
  }

  // Initial check
  checkAndRefresh()

  // Set up periodic checks
  refreshTimer = setInterval(checkAndRefresh, SESSION_CONFIG.CHECK_INTERVAL_MS)

  // Clean up on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', stopSessionRefresh)
  }
}

/**
 * Stop automatic session refresh
 */
export function stopSessionRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }

  if (typeof window !== 'undefined') {
    window.removeEventListener('beforeunload', stopSessionRefresh)
  }
}

/**
 * Manually trigger a session refresh
 */
export async function refreshSession() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      console.error('[Session] Manual refresh failed:', error)
      return { success: false, error }
    }

    console.log('[Session] Manual refresh successful')
    return { success: true, session: data.session }
  } catch (error) {
    console.error('[Session] Manual refresh error:', error)
    return { success: false, error }
  }
}

/**
 * React hook for session refresh
 * Use in client components that need session management
 *
 * @example
 * ```tsx
 * 'use client'
 * import { useSessionRefresh } from '@/lib/auth/session-refresh'
 *
 * export function Dashboard() {
 *   useSessionRefresh()
 *   // ... rest of component
 * }
 * ```
 */
export function useSessionRefresh() {
  if (typeof window === 'undefined') {
    return
  }

  // Start refresh on mount
  React.useEffect(() => {
    startSessionRefresh()
    return () => stopSessionRefresh()
  }, [])
}

// For backwards compatibility with React import
import * as React from 'react'
