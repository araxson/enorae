import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getProfileSummary(userId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('get_profile_summary', { p_user_id: userId })
    .single()

  if (error) throw error
  return data
}

export async function getMyProfileSummary() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('get_my_profile')
    .single()

  if (error) throw error
  return data
}
