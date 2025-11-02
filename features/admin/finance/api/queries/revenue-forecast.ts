import 'server-only'

import type { RevenueForecast } from '@/features/admin/finance/types'
import { requireAdminClient } from './client'
import { createOperationLogger } from '@/lib/observability'

const DEFAULT_FORECAST_DAYS = 30
const HISTORICAL_DATA_DAYS = 90

export async function getRevenueForecast(days = DEFAULT_FORECAST_DAYS): Promise<RevenueForecast[]> {
  const logger = createOperationLogger('getRevenueForecast', {})
  logger.start()

  const supabase = await requireAdminClient()

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - HISTORICAL_DATA_DAYS)

  const { data, error } = await supabase
    .from('admin_revenue_overview_view')
    .select('*')
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) throw error

  const revenueData = data || []
  const dailyRevenue = revenueData.reduce<Record<string, number>>((acc, row) => {
    const date = row.date
    if (date) {
      acc[date] = (acc[date] || 0) + (Number(row.total_revenue) || 0)
    }
    return acc
  }, {})

  const revenues = Object.values(dailyRevenue)
  const avgDailyRevenue =
    revenues.length > 0 ? revenues.reduce((sum, value) => sum + value, 0) / revenues.length : 0

  const forecast: RevenueForecast[] = []

  for (let i = 0; i < days; i++) {
    const forecastDate = new Date()
    forecastDate.setDate(forecastDate.getDate() + i)
    const dateStr = forecastDate.toISOString().split('T')[0]
    if (!dateStr) continue

    const FORECAST_VARIANCE_RANGE = 0.2
    const FORECAST_VARIANCE_OFFSET = 0.1
    const forecastedAmount = avgDailyRevenue * (1 + (Math.random() * FORECAST_VARIANCE_RANGE - FORECAST_VARIANCE_OFFSET))

    forecast.push({
      date: dateStr,
      forecast: forecastedAmount,
      actual: dailyRevenue[dateStr],
    })
  }

  return forecast
}
