'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import { revokeSessionSchema } from '../schema'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Revoke a specific session (sign out from specific device)
 * IMPROVED: Uses identity.sessions table for application session management
 * SECURITY: Validates input with Zod schema (SEC-M302)
 */
export async function revokeSession(sessionId: string): Promise<ActionResponse> {
  const logger = createOperationLogger('revokeSession', {})
  logger.start()

  try {
    // SEC-M302: Validate input with Zod schema
    const result = revokeSessionSchema.safeParse({ sessionId })

    if (!result.success) {
      return { success: false, error: 'Invalid session ID' }
    }

    const validated = result.data

    const session = await verifySession()
    if (!session) return { success: false, error: 'Unauthorized' }

    const supabase = await createClient()
    const { user } = session

    // Check if trying to revoke current session
    const { data: targetSession, error: targetError } = await supabase
      .from('sessions_view')
      .select('id, is_active')
      .eq('id', validated.sessionId)
      .eq('user_id', user.id)
      .maybeSingle<
        Pick<Database['public']['Views']['sessions_view']['Row'], 'id' | 'is_active'>
      >()

    if (targetError) throw targetError

    if (!targetSession) {
      return { success: false, error: 'Session not found' }
    }

    // Note: Revoking a session sets is_active to false
    if (!targetSession.is_active) {
      return { success: false, error: 'Session is already inactive.' }
    }

    // FIXED: Update identity.sessions table to mark as inactive
    const { error } = await supabase
      .schema('identity')
      .from('sessions')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by_id: user.id,
      })
      .eq('id', validated.sessionId)
      .eq('user_id', user.id)

    if (error) throw error

    revalidatePath('/customer/settings/sessions', 'page')
    revalidatePath('/staff/settings/sessions', 'page')

    return { success: true, data: undefined }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
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
  const logger = createOperationLogger('revokeAllOtherSessions', {})
  logger.start()

  try {
    const session = await verifySession()
    if (!session) return { success: false, error: 'Unauthorized' }

    const supabase = await createClient()
    const { user } = session

    // Resolve the current session from the secure view to avoid token comparison
    const { data: currentSession, error: currentError } = await supabase
      .from('sessions_view')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle<Pick<Database['public']['Views']['sessions_view']['Row'], 'id'>>()

    if (currentError) throw currentError

    if (!currentSession || typeof currentSession.id !== 'string') {
      return { success: false, error: 'No active session' }
    }

    // FIXED: Update identity.sessions table to revoke all other sessions
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
      .neq('id', currentSession.id as string)
      .select('id')

    if (error) throw error

    revalidatePath('/customer/settings/sessions', 'page')
    revalidatePath('/staff/settings/sessions', 'page')

    logger.success({ count: data?.length ?? 0 })

    return {
      success: true,
      data: { count: data?.length ?? 0 }
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to revoke sessions',
    }
  }
}
