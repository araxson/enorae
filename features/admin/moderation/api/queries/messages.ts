import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'
import { QUERY_LIMITS } from '@/lib/config/constants'

type MessageThread = Database['public']['Views']['admin_messages_overview_view']['Row']

/**
 * Get message threads for monitoring
 * SECURITY: Platform admin only
 */
export async function getMessageThreadsForMonitoring(): Promise<MessageThread[]> {
  const logger = createOperationLogger('getMessageThreadsForMonitoring', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_messages_overview_view')
    .select('id, salon_id, salon_name, customer_id, customer_name, staff_id, staff_name, subject, last_message_at, last_message_preview, total_messages, is_archived, created_at')
    .order('last_message_at', { ascending: false })
    .limit(QUERY_LIMITS.MESSAGE_HISTORY)

  if (error) throw error
  return (data || []) as unknown as MessageThread[]
}
