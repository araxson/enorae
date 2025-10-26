import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export interface StaffRevenueBreakdown {
  service_id: string
  service_name: string
  bookings_count: number
  total_revenue: number
  avg_price: number
}

export async function getStaffRevenueBreakdown(
  staffId?: string,
  startDate?: string,
  endDate?: string
): Promise<StaffRevenueBreakdown[]> {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const targetStaffId = staffId || user.id
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const end = endDate || new Date().toISOString()

  // Get appointments with service information and prices
  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select('service_id, service_name, total_price')
    .eq('staff_id', targetStaffId)
    .eq('status', 'completed')
    .gte('created_at', start)
    .lte('created_at', end)

  if (error) throw error

  if (!appointments || appointments.length === 0) {
    return []
  }

  type AppointmentRevenue = {
    service_id: string | null
    service_name: string | null
    total_price: number | null
  }

  type RevenueData = {
    name: string
    count: number
    revenue: number
  }

  // Aggregate revenue by service
  const revenueMap = new Map<string, RevenueData>()
  const appointmentData = (appointments as AppointmentRevenue[]) || []

  appointmentData.forEach((apt: AppointmentRevenue) => {
    const serviceId = apt.service_id || 'unknown'
    const serviceName = apt.service_name || 'Unknown Service'
    const price = Number(apt.total_price) || 0

    if (!revenueMap.has(serviceId)) {
      revenueMap.set(serviceId, {
        name: serviceName,
        count: 0,
        revenue: 0,
      })
    }

    const current = revenueMap.get(serviceId)!
    current.count += 1
    current.revenue += price
  })

  return Array.from(revenueMap.entries()).map(([serviceId, data]: [string, RevenueData]) => ({
    service_id: serviceId,
    service_name: data.name,
    bookings_count: data.count,
    total_revenue: data.revenue,
    avg_price: data.count > 0 ? data.revenue / data.count : 0,
  }))
}
