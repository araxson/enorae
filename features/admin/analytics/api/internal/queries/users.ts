import 'server-only';
import { requireAdminClient } from '@/features/admin/analytics/api/admin-analytics-shared'
import type { AdminUserRow } from '@/features/admin/analytics/api/admin-analytics-types'

const USERS_TABLE = 'admin_users_overview'

export async function getAllUsers(): Promise<AdminUserRow[]> {
  const supabase = await requireAdminClient()
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
