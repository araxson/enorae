import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

/**
 * Get unread notification count for current user
 */
export async function getUnreadCount() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase.rpc('get_unread_count', {
    p_user_id: user.id,
  })

  if (error) throw error

  return data as number
}

/**
 * Get unread counts for messages and notifications
 */
export async function getUnreadCounts() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase.rpc('get_unread_counts', {
    p_user_id: user.id,
  })

  if (error) throw error

  return (
    data as {
      messages: number
      notifications: number
      total: number
    }[]
  )?.[0] || { messages: 0, notifications: 0, total: 0 }
}

/**
 * Get recent notifications for business users
 * Since there's no notifications table in the schema, we use messages as notifications
 */
export async function getRecentNotifications(limit: number = 20) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get system messages that serve as notifications
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('to_user_id', user.id)
    .eq('context_type', 'system')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return data || []
}

/**
 * Get notification preferences for user
 * Note: This would need to be implemented in the database
 */
export async function getNotificationPreferences() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // TODO: Implement when notification_preferences table is created
  // For now, return default preferences
  return {
    email: {
      appointment_confirmation: true,
      appointment_reminder: true,
      appointment_cancelled: true,
      review_request: true,
      staff_message: true,
      system_alert: true,
    },
    sms: {
      appointment_confirmation: false,
      appointment_reminder: true,
      appointment_cancelled: true,
      review_request: false,
      staff_message: false,
      system_alert: false,
    },
    in_app: {
      appointment_confirmation: true,
      appointment_reminder: true,
      appointment_cancelled: true,
      review_request: true,
      staff_message: true,
      system_alert: true,
    },
  }
}
