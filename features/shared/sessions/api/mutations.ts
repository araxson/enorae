'use server'

import { revalidatePath } from 'next/cache'

import { requireSessionContext } from './session-context'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Revoke a specific session (sign out from specific device)
 * IMPROVED: Uses identity.sessions table for application session management
 */
export async function revokeSession(sessionId: string): Promise<ActionResponse> {
  try {
    if (!UUID_REGEX.test(sessionId)) {
      return { success: false, error: 'Invalid session ID format' }
    }

    const { supabase, user } = await requireSessionContext()

    // Check if session exists and belongs to user
    const { data: targetSession, error: targetError } = await supabase
      .from('sessions')
      .select('id, is_active')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .maybeSingle<{ id: string; is_active: boolean | null }>()

    if (targetError) throw targetError

    if (!targetSession) {
      return { success: false, error: 'Session not found' }
    }

    // ✅ FIXED: Update identity.sessions table to mark as inactive
    const { error } = await supabase
      .schema('identity')
      .from('sessions')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by_id: user.id,
      })
      .eq('id', sessionId)
      .eq('user_id', user.id)

    if (error) throw error

    revalidatePath('/customer/settings/sessions')
    revalidatePath('/staff/settings/sessions')

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error revoking session:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to revoke session',
    }
  }
}

/**
 * Revoke all other sessions (sign out from all other devices)
 * IMPROVED: Uses identity.sessions table for application session management
 */
export async function revokeAllOtherSessions(): Promise<ActionResponse<{ count: number }>> {
  try {
    const { supabase, user } = await requireSessionContext()

    // Get all active sessions to find count (we'll keep the most recently updated one)
    type SessionData = { id: string; updated_at: string }
    const { data: activeSessions, error: fetchError } = await supabase
      .from('sessions')
      .select('id, updated_at')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })
      .returns<SessionData[]>()

    if (fetchError) throw fetchError

    if (!activeSessions || activeSessions.length === 0) {
      return { success: false, error: 'No active sessions found' }
    }

    // Keep the most recently updated session (likely the current one)
    const currentSessionId = activeSessions[0].id
    const sessionIdsToRevoke = activeSessions.slice(1).map(s => s.id)

    if (sessionIdsToRevoke.length === 0) {
      return { success: true, data: { count: 0 } }
    }

    // ✅ FIXED: Update identity.sessions table to revoke all other sessions
    const { data, error } = await supabase
      .schema('identity')
      .from('sessions')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by_id: user.id,
      })
      .eq('user_id', user.id)
      .eq('is_active', true)
      .neq('id', currentSessionId)
      .select('id')

    if (error) throw error

    revalidatePath('/customer/settings/sessions')
    revalidatePath('/staff/settings/sessions')

    return {
      success: true,
      data: { count: data?.length ?? 0 }
    }
  } catch (error) {
    console.error('Error revoking sessions:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to revoke sessions',
    }
  }
}
