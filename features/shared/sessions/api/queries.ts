import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

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
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // ✅ FIXED: Query identity.sessions via public view (application sessions)
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })

  if (error) throw error

  // Get current Supabase auth session to mark the matching application session
  const { data: { session: currentSession } } = await supabase.auth.getSession()

  // Mark current session based on session_token matching
  const sessions = data || []
  return sessions.map((session: Session) => ({
    ...session,
    is_current: currentSession?.access_token === session.session_token,
  }))
}

/**
 * Get session count for the current user
 * IMPROVED: Uses identity.sessions view
 */
export async function getSessionCount(): Promise<number> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

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
