import 'server-only'
import { guardQuery } from '@/lib/auth'

export async function getProfileSummary(userId: string) {
  const { supabase } = await guardQuery()

  // Fetch user profile directly
  const { data, error } = await supabase
    .from('admin_users_overview_view')
    .select('id, email, first_name, last_name, username, avatar_url, role, status, created_at')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function getMyProfileSummary() {
  const { user, supabase } = await guardQuery()

  // Fetch current user's profile directly
  const { data, error } = await supabase
    .from('admin_users_overview_view')
    .select('id, email, first_name, last_name, username, avatar_url, role, status, created_at')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}
