import 'server-only'

import type { FinancialExportData } from '@/features/admin/finance/api/types'
import { getPlatformRevenueAnalytics } from './get-platform-revenue-analytics'
import { requireAdminClient } from './client'

export async function getFinancialExportData(
  startDate: string,
  endDate: string,
): Promise<FinancialExportData> {
  const supabase = await requireAdminClient()

  const summary = await getPlatformRevenueAnalytics(startDate, endDate)

  const { data: revenueData, error: revenueError } = await supabase
    .from('admin_revenue_overview')
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

  const { data: transactions, error: txError } = await supabase
    .from('manual_transactions')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: true })

  if (txError) throw txError

  return {
    summary,
    revenueByDate,
    transactions: transactions || [],
  }
}
