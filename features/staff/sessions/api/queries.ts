import 'server-only'
import { verifySession } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import type { Session } from '../types'

export async function getMySessions(): Promise<Session[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('last_active_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getCurrentSessionId(): Promise<string | null> {
  const session = await verifySession()
  if (!session) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('is_current', true)
    .maybeSingle<{ id: string | null }>()

  if (error) throw error
  return data?.id ?? null
}