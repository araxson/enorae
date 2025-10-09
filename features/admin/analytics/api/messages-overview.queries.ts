import 'server-only';
import { requireAdminClient } from './admin-analytics-shared'
import type { AdminMessageRow } from './admin-analytics-types'

const MESSAGES_TABLE = 'admin_messages_overview'

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
