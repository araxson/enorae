import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getProfileSummary(userId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Fetch user profile directly
  const { data, error } = await supabase
    .from('admin_users_overview_view')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function getMyProfileSummary() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Fetch current user's profile directly
  const { data, error } = await supabase
    .from('admin_users_overview_view')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}
