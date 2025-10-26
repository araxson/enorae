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

  // Count unread messages
  const { count: messagesCount } = await supabase
    .schema('communication')
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('to_user_id', userId)
    .eq('is_read', false)

  // Count unread notifications - use messages view for notifications
  const messages = messagesCount || 0

  return {
    messages,
    notifications: 0,
    total: messages,
  }
}

export async function getMyUnreadCounts(): Promise<UnreadCounts | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  return getUnreadCounts(user.id)
}


export async function getThreadById(threadId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .schema('communication')
    .from("message_threads")
    .select("*")
    .eq("id", threadId)
    .single()

  if (error) throw error
  return data
}

export async function getMessageThreadsByUser(userId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .schema('communication')
    .from("message_threads")
    .select("*")
    .or(`customer_id.eq.${userId},staff_id.eq.${userId}`)
    .order("last_message_at", { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getMessagesBetweenUsers(userId1: string, userId2: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .schema('communication')
    .from("messages")
    .select("*")
    .or(`from_user_id.eq.${userId1},to_user_id.eq.${userId1}`)
    .or(`from_user_id.eq.${userId2},to_user_id.eq.${userId2}`)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data ?? []
}
