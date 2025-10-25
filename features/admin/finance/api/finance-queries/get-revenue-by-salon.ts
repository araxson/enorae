import 'server-only'

import type { AdminRevenueRow } from '@/features/admin/finance/api/types'
import { requireAdminClient } from './client'

export async function getRevenueBySalon(
  startDate?: string,
  endDate?: string,
  limit = 20,
): Promise<AdminRevenueRow[]> {
  const supabase = await requireAdminClient()

  let query = supabase
    .from('admin_revenue_overview_view')
    .select('*')
    .order('total_revenue', { ascending: false })
    .limit(limit)

  if (startDate) {
    query = query.gte('date', startDate)
  }

  if (endDate) {
    query = query.lte('date', endDate)
  }

  const { data, error } = await query
  if (error) throw error

  return data || []
}
