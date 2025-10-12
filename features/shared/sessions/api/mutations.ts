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

    // Check if trying to revoke current session
    const { data: targetSession, error: targetError } = await supabase
      .from('sessions')
      .select('id, is_current, is_active')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .maybeSingle<{ id: string; is_current: boolean | null; is_active: boolean | null }>()

    if (targetError) throw targetError

    if (!targetSession) {
      return { success: false, error: 'Session not found' }
    }

    if (targetSession.is_current) {
      return { success: false, error: 'Cannot revoke current session. Use sign out instead.' }
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

    // Resolve the current session from the secure view to avoid token comparison
    const { data: currentSession, error: currentError } = await supabase
      .from('sessions')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .eq('is_current', true)
      .maybeSingle<{ id: string }>()

    if (currentError) throw currentError

    if (!currentSession) {
      return { success: false, error: 'No active session' }
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
      .neq('id', currentSession.id)
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
