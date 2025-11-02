import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

// FIXED: Use public sessions_view (application sessions metadata)
type Session = Database['public']['Views']['sessions_view']['Row']

export type SessionWithMetadata = Session & {
  is_current: boolean
}

export type SessionWithDevice = SessionWithMetadata

/**
 * Get all active sessions for the current user
 * IMPROVED: Uses identity.sessions view (application sessions)
 */
export async function getUserSessions(): Promise<SessionWithMetadata[]> {
  const logger = createOperationLogger('getUserSessions', {})
  logger.start()

  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // ✅ FIXED: Query identity.sessions via public view (application sessions)
  const { data, error } = await supabase
    .from('sessions_view')
    .select('*')
    .eq('user_id', session.user.id)
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
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // ✅ FIXED: Query identity.sessions via public view
  const { count, error } = await supabase
    .from('sessions_view')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
    .eq('is_active', true)
    .is('deleted_at', null)

  if (error) throw error
  return count || 0
}
