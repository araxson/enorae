import 'server-only'

import type { SalonRevenueRow } from './types'
import { requireAdminClient } from './client'

export async function getRevenueBySalon(
  startDate?: string,
  endDate?: string,
  limit = 20,
): Promise<SalonRevenueRow[]> {
  const supabase = await requireAdminClient()

  // Query daily_metrics from analytics schema and aggregate by salon
  let query = supabase
    .schema('analytics')
    .from('daily_metrics')
    .select(`
      salon_id,
      total_revenue,
      service_revenue,
      product_revenue,
      total_appointments,
      completed_appointments,
      cancelled_appointments
    `)

  if (startDate) {
    query = query.gte('metric_at', startDate)
  }

  if (endDate) {
    query = query.lte('metric_at', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  if (!data || data.length === 0) return []

  // Get unique salon IDs
  const salonIds = Array.from(new Set(data.map((row: any) => row.salon_id)))

  // Fetch salon details with chain info
  const { data: salonsData } = await supabase
    .from('admin_salons_overview_view')
    .select('id, name, chain_name')
    .in('id', salonIds)

  // Create a map of salon details
  const salonsMap = new Map(
    salonsData?.map(salon => [salon.id, salon]) || []
  )

  // Aggregate by salon
  const salonMap = new Map<string, any>()

  data.forEach((row: any) => {
    const salonId = row.salon_id
    const salonInfo = salonsMap.get(salonId)

    if (!salonMap.has(salonId)) {
      salonMap.set(salonId, {
        salon_id: salonId,
        salon_name: salonInfo?.name || 'Unknown Salon',
        chain_name: salonInfo?.chain_name || null,
        total_revenue: 0,
        service_revenue: 0,
        product_revenue: 0,
        total_appointments: 0,
        completed_appointments: 0,
        cancelled_appointments: 0,
      })
    }

    const salon = salonMap.get(salonId)
    salon.total_revenue += Number(row.total_revenue || 0)
    salon.service_revenue += Number(row.service_revenue || 0)
    salon.product_revenue += Number(row.product_revenue || 0)
    salon.total_appointments += Number(row.total_appointments || 0)
    salon.completed_appointments += Number(row.completed_appointments || 0)
    salon.cancelled_appointments += Number(row.cancelled_appointments || 0)
  })

  // Calculate completion rate and sort by revenue
  const aggregated = Array.from(salonMap.values())
    .map(salon => ({
      ...salon,
      completion_rate: salon.total_appointments > 0
        ? salon.completed_appointments / salon.total_appointments
        : 0,
    }))
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, limit)

  return aggregated
}
