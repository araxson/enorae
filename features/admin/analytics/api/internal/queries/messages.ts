import 'server-only';
import { requireAdminClient } from '@/features/admin/analytics/api/admin-analytics-shared'
import type { AdminMessageRow } from '@/features/admin/analytics/api/admin-analytics-types'

const MESSAGES_TABLE = 'admin_messages_overview_view'

export async function getMessagesOverview(limit = 100): Promise<AdminMessageRow[]> {
  const supabase = await requireAdminClient()
  const { data, error } = await supabase
    .from(MESSAGES_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}
