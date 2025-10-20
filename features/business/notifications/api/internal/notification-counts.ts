import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

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

  const { data, error } = await supabase
    .schema('communication')
    .rpc('get_unread_count', {
      p_user_id: user.id,
    })

  if (error) throw error

  return (data as Database['communication']['Functions']['get_unread_count']['Returns']) ?? 0
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

  const { data, error } = await supabase
    .schema('communication')
    .rpc('get_unread_counts', {
      p_user_id: user.id,
    })

  if (error) throw error

  const [counts] =
    (data as Database['communication']['Functions']['get_unread_counts']['Returns']) ?? []

  return counts ?? { messages: 0, notifications: 0, total: 0 }
}
