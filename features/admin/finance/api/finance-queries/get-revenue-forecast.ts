import 'server-only'

import type { RevenueForecast } from '@/features/admin/finance/api/types'
import { requireAdminClient } from './client'

export async function getRevenueForecast(days = 30): Promise<RevenueForecast[]> {
  const supabase = await requireAdminClient()

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 90)

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

    forecast.push({
      date: dateStr,
      forecast: avgDailyRevenue * (1 + (Math.random() * 0.2 - 0.1)),
      actual: dailyRevenue[dateStr],
    })
  }

  return forecast
}
