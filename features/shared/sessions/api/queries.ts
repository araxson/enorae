import 'server-only'
import type { Database } from '@/lib/types/database.types'

import { requireSessionContext } from './session-context'

// FIXED: Use identity.sessions view (application sessions, not auth.sessions)
type Session = Database['public']['Views']['sessions']['Row']

export type SessionWithMetadata = Session & {
  is_current: boolean
}

export type SessionWithDevice = SessionWithMetadata

/**
 * Get all active sessions for the current user
 * IMPROVED: Uses identity.sessions view (application sessions)
 */
export async function getUserSessions(): Promise<SessionWithMetadata[]> {
  const { supabase, user } = await requireSessionContext()

  // ✅ FIXED: Query identity.sessions via public view (application sessions)
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })

  if (error) throw error
  const sessions = data || []
  return sessions.map((session: Session) => ({
    ...session,
    is_current: false, // Note: is_current field not available in view
  }))
}

/**
 * Get session count for the current user
 * IMPROVED: Uses identity.sessions view
 */
export async function getSessionCount(): Promise<number> {
  const { supabase, user } = await requireSessionContext()

  // ✅ FIXED: Query identity.sessions via public view
  const { count, error } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_active', true)
    .is('deleted_at', null)

  if (error) throw error
  return count || 0
}