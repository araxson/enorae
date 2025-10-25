import 'server-only'

import type { AdminRevenueRow, ChainRevenueData } from '@/features/admin/finance/api/types'
import { requireAdminClient } from './client'

export async function getRevenueByChain(
  _startDate?: string,
  _endDate?: string,
): Promise<ChainRevenueData[]> {
  // Chain revenue by salon feature not implemented
  // TODO: Add salon_id and chain_name to admin_revenue_overview_view or create new view
  return []
}
