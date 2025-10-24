import 'server-only';
import { requireAdminClient } from '@/features/admin/analytics/api/internal/admin-analytics-shared'
import type { AdminRevenueRow } from '@/features/admin/analytics/api/internal/admin-analytics-types'

const REVENUE_TABLE = 'admin_revenue_overview'
const DEFAULT_LIMIT = 30

export async function getRevenueOverview(limit: number = DEFAULT_LIMIT): Promise<AdminRevenueRow[]> {
  const supabase = await requireAdminClient()
  const { data, error } = await supabase
    .from(REVENUE_TABLE)
    .select('*')
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}
