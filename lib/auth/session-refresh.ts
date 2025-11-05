/**
 * Session Management Utilities
 *
 * IMPORTANT: Automatic session refresh is handled by middleware (lib/supabase/middleware.ts)
 * This file provides utilities for session monitoring and auth state changes only.
 *
 * DO NOT manually call refreshSession() - middleware handles token rotation automatically.
 * Manual refresh calls break token rotation security (GOTRUE_SECURITY_REFRESH_TOKEN_ROTATION_ENABLED).
 *
 * See docs/rules/09-auth.md for details.
 */

import * as React from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

/**
 * React hook for auth state monitoring
 * Listens for auth state changes and redirects to login on sign-out
 *
 * @example
 * ```tsx
 * 'use client'
 * import { useAuthStateMonitor } from '@/lib/auth/session-refresh'
 *
 * export function Dashboard() {
 *   useAuthStateMonitor()
 *   // ... rest of component
 * }
 * ```
 */
export function useAuthStateMonitor(): void {
  const router = useRouter()

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    // Client-side usage: createClient() is synchronous for browser
    const supabase = createClient()

    // Listen for auth state changes (sign out, token refresh, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // User signed out - redirect to login
        router.push('/login')
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('[Session] Token refreshed by middleware')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])
}

/**
 * @deprecated Use useAuthStateMonitor instead
 * Middleware handles session refresh automatically
 */
export function useSessionRefresh(): void {
  console.warn(
    '[Session] useSessionRefresh is deprecated. Middleware handles session refresh automatically. Use useAuthStateMonitor for auth state monitoring only.'
  )
  useAuthStateMonitor()
}
