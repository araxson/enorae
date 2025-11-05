import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

/**
 * DATABASE PATTERN NOTE: Currently reading from communication.messages table
 *
 * Future enhancement: Create view_notifications in communication schema for optimized reads.
 * The view should include: message fields + sender info + context details.
 * This would improve query performance and simplify the query interface.
 */

type Message = Database['communication']['Tables']['messages']['Row']

export async function getNotifications(limit = 50) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Use messages table to get notifications (messages sent to the user)
  const { data, error } = await supabase
    .schema('communication')
    .from('messages')
    .select('id, from_user_id, to_user_id, content, context_type, is_read, created_at')
    .eq('to_user_id', user.id)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Message[]
}

export async function getUnreadNotificationsCount(): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Count unread messages
  const { count, error } = await supabase
    .schema('communication')
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('to_user_id', user.id)
    .eq('is_read', false)

  if (error) {
    console.error('Error getting unread count:', error)
    return 0
  }

  return count || 0
}

export async function getNotificationsByChannel(channel: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Use messages table with context_type filter for channel
  const { data, error } = await supabase
    .schema('communication')
    .from('messages')
    .select('id, from_user_id, to_user_id, content, context_type, is_read, created_at')
    .eq('to_user_id', user.id)
    .eq('context_type', channel)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return data as Message[]
}