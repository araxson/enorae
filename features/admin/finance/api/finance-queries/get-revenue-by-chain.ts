import 'server-only'

import type { AdminRevenueRow, ChainRevenueData } from '@/features/admin/finance/api/types'
import { requireAdminClient } from './client'

export async function getRevenueByChain(
  startDate?: string,
  endDate?: string,
): Promise<ChainRevenueData[]> {
  const supabase = await requireAdminClient()

  let query = supabase.from('admin_revenue_overview').select('*')

  if (startDate) {
    query = query.gte('date', startDate)
  }

  if (endDate) {
    query = query.lte('date', endDate)
  }

  const { data, error } = await query
  if (error) throw error

  const revenueData = (data || []) as AdminRevenueRow[]
  const chainMap = new Map<string, { revenue: number; salons: Set<string> }>()

  revenueData.forEach((row) => {
    const chainName = row.chain_name || 'Unassigned'
    const chainEntry = chainMap.get(chainName) ?? { revenue: 0, salons: new Set<string>() }

    chainEntry.revenue += Number(row.total_revenue) || 0
    if (row.salon_id) {
      chainEntry.salons.add(row.salon_id)
    }

    chainMap.set(chainName, chainEntry)
  })

  return Array.from(chainMap.entries())
    .map(([chainName, entry]) => ({
      chainName,
      totalRevenue: entry.revenue,
      salonCount: entry.salons.size,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
}
