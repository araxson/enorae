import 'server-only';
import { requireAdminClient } from '../admin-analytics-shared'
import type { AdminSalonRow } from '../admin-analytics-types'

const SALONS_TABLE = 'admin_salons_overview'

export async function getAllSalons(): Promise<AdminSalonRow[]> {
  const supabase = await requireAdminClient()
  const { data, error } = await supabase
    .from(SALONS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
