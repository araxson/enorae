'use server'
import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

type ActionResult<T = void> = {
  success: boolean
  error?: string
  data?: T
}

export async function revokeSession(sessionId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to revoke sessions' }
    }

    // Verify the session belongs to the user
    const { data: sessionData } = await supabase
      .from('sessions_view')
      .select('user_id')
      .eq('id', sessionId)
      .single<{ user_id: string | null }>()

    if (!sessionData || sessionData.user_id !== user.id) {
      return { success: false, error: 'You do not have permission to revoke this session' }
    }

    // Soft delete the session
    const { error } = await supabase
      .schema('identity')
      .from('sessions')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', sessionId)

    if (error) {
      console.error('Session revocation error:', error)
      return { success: false, error: 'Failed to revoke session. Please try again.' }
    }

    revalidatePath('/staff/settings/sessions', 'page')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error revoking session:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function revokeAllSessions(): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to revoke sessions' }
    }

    const { data: currentSession, error: currentSessionError } = await supabase
      .from('sessions_view')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_current', true)
      .maybeSingle<{ id: string | null }>()

    if (currentSessionError) {
      console.error('Current session lookup error:', currentSessionError)
      return { success: false, error: 'Failed to identify current session. Please try again.' }
    }

    let updateQuery = supabase
      .schema('identity')
      .from('sessions')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (currentSession?.id) {
      updateQuery = updateQuery.neq('id', currentSession.id)
    }

    const { error } = await updateQuery

    if (error) {
      console.error('Session revocation error:', error)
      return { success: false, error: 'Failed to revoke all sessions. Please try again.' }
    }

    revalidatePath('/staff/settings/sessions', 'page')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error revoking all sessions:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
