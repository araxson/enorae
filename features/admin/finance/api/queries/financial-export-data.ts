import 'server-only'

import type { FinancialExportData } from '@/features/admin/finance/types'
import { requireAdminClient } from './client'
import { getPlatformRevenueAnalytics } from './platform-revenue-analytics'
import { createOperationLogger } from '@/lib/observability'

export async function getFinancialExportData(
  startDate: string,
  endDate: string,
): Promise<FinancialExportData> {
  const logger = createOperationLogger('getFinancialExportData', {})
  logger.start()

  const supabase = await requireAdminClient()

  const summary = await getPlatformRevenueAnalytics(startDate, endDate)

  const { data: revenueData, error: revenueError } = await supabase
    .from('admin_revenue_overview_view')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (revenueError) throw revenueError

  const revenueByDate = (revenueData || []).reduce(
    (acc: { date: string; revenue: number; appointments: number }[], row) => {
      const date = row.date || ''
      const existing = acc.find((item) => item.date === date)
      if (existing) {
        existing.revenue += Number(row.total_revenue) || 0
        existing.appointments += row.total_appointments || 0
      } else {
        acc.push({
          date,
          revenue: Number(row.total_revenue) || 0,
          appointments: row.total_appointments || 0,
        })
      }
      return acc
    },
    [] as { date: string; revenue: number; appointments: number }[],
  )

  // Manual transactions are not included in this export
  // The manual_transactions table and query would be added here
  // when the manual transaction recording feature is implemented
  const transactions: never[] = []

  return {
    summary,
    revenueByDate,
    transactions,
  }
}
