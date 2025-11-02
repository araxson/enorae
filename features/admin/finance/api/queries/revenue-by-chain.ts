import 'server-only'

import type { AdminRevenueRow, ChainRevenueData } from '@/features/admin/finance/types'
import { requireAdminClient } from './client'
import { createOperationLogger } from '@/lib/observability'

export async function getRevenueByChain(
  _startDate?: string,
  _endDate?: string,
): Promise<ChainRevenueData[]> {
  const logger = createOperationLogger('getRevenueByChain', {})
  logger.start()

  // Chain revenue by salon feature requires additional view columns
  // This would require adding salon_id and chain_name to admin_revenue_overview_view
  // or creating a new dedicated view for chain revenue aggregation
  return []
}
