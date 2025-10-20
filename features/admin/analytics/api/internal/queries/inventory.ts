import 'server-only';
import { requireAdminClient } from '../../admin-analytics-shared'
import type { AdminInventoryRow } from '../../admin-analytics-types'

const INVENTORY_TABLE = 'admin_inventory_overview'

export async function getInventoryOverview(): Promise<AdminInventoryRow[]> {
  const supabase = await requireAdminClient()
  const { data, error } = await supabase
    .from(INVENTORY_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
