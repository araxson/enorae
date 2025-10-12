import 'server-only';
import { requireAdminClient } from '../admin-analytics-shared'
import type { AdminStaffRow } from '../admin-analytics-types'

const STAFF_TABLE = 'admin_staff_overview'

export async function getAllStaff(): Promise<AdminStaffRow[]> {
  const supabase = await requireAdminClient()
  const { data, error } = await supabase
    .from(STAFF_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
