'use server'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export async function revokeSession(sessionId: string) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Verify the session belongs to the user
  const { data: sessionData } = await supabase
    .from('sessions_view')
    .select('user_id')
    .eq('id', sessionId)
    .single<{ user_id: string | null }>()

  if (!sessionData || sessionData.user_id !== session.user.id) {
    throw new Error('Unauthorized to revoke this session')
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

  if (error) throw error

  revalidatePath('/staff/settings/sessions', 'page')
}

export async function revokeAllSessions() {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data: currentSession, error: currentSessionError } = await supabase
    .from('sessions_view')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('is_current', true)
    .maybeSingle<{ id: string | null }>()

  if (currentSessionError) throw currentSessionError

  let updateQuery = supabase
    .schema('identity')
    .from('sessions')
    .update({
      is_active: false,
      deleted_at: new Date().toISOString(),
    })
    .eq('user_id', session.user.id)

  if (currentSession?.id) {
    updateQuery = updateQuery.neq('id', currentSession.id)
  }

  const { error } = await updateQuery

  if (error) throw error

  revalidatePath('/staff/settings/sessions', 'page')
}
