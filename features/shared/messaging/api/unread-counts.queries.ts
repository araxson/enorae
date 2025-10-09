import 'server-only'
import { createClient } from '@/lib/supabase/server'

interface UnreadCounts {
  messages: number
  notifications: number
  total: number
}

export async function getUnreadCounts(userId: string): Promise<UnreadCounts | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('get_unread_counts', { p_user_id: userId })
    .single()

  if (error) throw error
  return data
}

export async function getMyUnreadCounts(): Promise<UnreadCounts | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('get_unread_counts', { p_user_id: user.id })
    .single()

  if (error) throw error
  return data
}
