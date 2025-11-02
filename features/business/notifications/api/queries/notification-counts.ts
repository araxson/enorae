import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'

/**
 * Get unread notification count for current user
 */
export async function getUnreadCount() {
  const logger = createOperationLogger('getUnreadCount', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Use RPC function to get unread count
  const { data: count, error } = await supabase
    .schema('communication')
    .rpc('get_unread_count', {
      p_user_id: user['id'],
    })

  if (error) throw error

  return count ?? 0
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

  // Use RPC function to get unread counts
  const { data, error } = await supabase
    .schema('communication')
    .rpc('get_unread_counts', {
      p_user_id: user['id'],
    })

  if (error) throw error

  // Return first result or defaults
  const result = data && data.length > 0 ? data[0] : { messages: 0, notifications: 0, total: 0 }

  return {
    messages: result?.['messages'] ?? 0,
    notifications: result?.['notifications'] ?? 0,
    total: result?.['total'] ?? 0,
  }
}
