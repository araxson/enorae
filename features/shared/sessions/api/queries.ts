import 'server-only'

import { requireSessionContext } from './session-context'
import type { Session, SessionWithMetadata, SessionWithDevice } from '@/features/shared/sessions/types'

// Re-export types for components
export type { SessionWithDevice } from '@/features/shared/sessions/types'

/**
 * Get all active sessions for the current user
 * IMPROVED: Uses identity.sessions view (application sessions)
 */
export async function getUserSessions(): Promise<SessionWithMetadata[]> {
  const { supabase, user } = await requireSessionContext()

  // ✅ FIXED: Query identity.sessions via public view (application sessions)
  const { data, error } = await supabase
    .from('sessions_view')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data || []) as SessionWithMetadata[]
}

/**
 * Get session count for the current user
 * IMPROVED: Uses identity.sessions view
 */
export async function getSessionCount(): Promise<number> {
  const { supabase, user } = await requireSessionContext()

  // ✅ FIXED: Query identity.sessions via public view
  const { count, error } = await supabase
    .from('sessions_view')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_active', true)
    .is('deleted_at', null)

  if (error) throw error
  return count || 0
}
