import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Session } from '@/features/staff/sessions/types'

export async function getMySessions(): Promise<Session[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data, error } = await supabase
    .from('sessions_view')
    .select('*')
    .eq('user_id', user.id)
    .order('last_active_at', { ascending: false })

  if (error) throw error
  return (data || []) as Session[]
}

export async function getCurrentSessionId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('sessions_view')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_current', true)
    .maybeSingle<{ id: string | null }>()

  if (error) throw error
  return data?.id ?? null
}
