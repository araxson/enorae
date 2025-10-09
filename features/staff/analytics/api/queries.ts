import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export interface StaffPerformanceMetrics {
  total_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  no_show_appointments: number
  completion_rate: number
  cancellation_rate: number
  unique_customers: number
  repeat_customers: number
  total_revenue: number
  avg_appointment_value: number
  period_start: string
  period_end: string
}

export interface StaffRevenueBreakdown {
  service_id: string
  service_name: string
  bookings_count: number
  total_revenue: number
  avg_price: number
}

export interface CustomerRelationship {
  customer_id: string
  customer_name: string
  total_appointments: number
  total_spent: number
  last_appointment_date: string
  favorite_service: string
}

export async function getStaffPerformanceMetrics(
  staffId?: string,
  startDate?: string,
  endDate?: string
): Promise<StaffPerformanceMetrics> {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const targetStaffId = staffId || user.id
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const end = endDate || new Date().toISOString()

  // Get appointment statistics
  const { data: appointments, error: apptError } = await supabase
    .from('appointments')
    .select('id, status, customer_id, created_at')
    .eq('staff_id', targetStaffId)
    .gte('created_at', start)
    .lte('created_at', end)

  if (apptError) throw apptError

  const totalAppointments = appointments?.length || 0
  const completedAppointments = appointments?.filter(a => a.status === 'completed').length || 0
  const cancelledAppointments = appointments?.filter(a => a.status === 'cancelled').length || 0
  const noShowAppointments = appointments?.filter(a => a.status === 'no_show').length || 0

  const uniqueCustomers = new Set(appointments?.map(a => a.customer_id)).size

  // Calculate repeat customers (customers with more than 1 appointment)
  const customerCounts = appointments?.reduce((acc, a) => {
    acc[a.customer_id] = (acc[a.customer_id] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const repeatCustomers = Object.values(customerCounts).filter(count => count > 1).length

  // Get revenue data from appointment services
  const appointmentIds = appointments?.map(a => a.id) || []

  let totalRevenue = 0
  if (appointmentIds.length > 0) {
    const { data: services } = await supabase
      .from('service_pricing')
      .select('price')
      .in('service_id', appointmentIds)

    totalRevenue = services?.reduce((sum, s) => sum + (Number(s.price) || 0), 0) || 0
  }

  return {
    total_appointments: totalAppointments,
    completed_appointments: completedAppointments,
    cancelled_appointments: cancelledAppointments,
    no_show_appointments: noShowAppointments,
    completion_rate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
    cancellation_rate: totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0,
    unique_customers: uniqueCustomers,
    repeat_customers: repeatCustomers,
    total_revenue: totalRevenue,
    avg_appointment_value: completedAppointments > 0 ? totalRevenue / completedAppointments : 0,
    period_start: start,
    period_end: end,
  }
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

  const { data: staffServices, error } = await supabase
    .from('staff_services')
    .select(`
      service_id,
      services:service_id (
        name,
        service_pricing (
          price
        )
      )
    `)
    .eq('staff_id', targetStaffId)

  if (error) throw error

  // Get appointments for this staff member
  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, created_at')
    .eq('staff_id', targetStaffId)
    .eq('status', 'completed')
    .gte('created_at', start)
    .lte('created_at', end)

  const appointmentIds = appointments?.map(a => a.id) || []

  if (appointmentIds.length === 0) {
    return []
  }

  // Aggregate revenue by service
  const revenueMap = new Map<string, { name: string; count: number; revenue: number; prices: number[] }>()

  staffServices?.forEach((ss: any) => {
    const serviceId = ss.service_id
    const serviceName = ss.services?.name || 'Unknown Service'
    const price = Number(ss.services?.service_pricing?.[0]?.price || 0)

    if (!revenueMap.has(serviceId)) {
      revenueMap.set(serviceId, {
        name: serviceName,
        count: 0,
        revenue: 0,
        prices: []
      })
    }

    const current = revenueMap.get(serviceId)!
    current.count += 1
    current.revenue += price
    current.prices.push(price)
  })

  return Array.from(revenueMap.entries()).map(([serviceId, data]) => ({
    service_id: serviceId,
    service_name: data.name,
    bookings_count: data.count,
    total_revenue: data.revenue,
    avg_price: data.count > 0 ? data.revenue / data.count : 0,
  }))
}

export async function getStaffCustomerRelationships(
  staffId?: string,
  limit = 20
): Promise<CustomerRelationship[]> {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const targetStaffId = staffId || user.id

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      id,
      customer_id,
      created_at,
      profiles:customer_id (
        display_name,
        email
      )
    `)
    .eq('staff_id', targetStaffId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error

  // Aggregate by customer
  const customerMap = new Map<string, {
    name: string
    appointments: number
    revenue: number
    lastDate: string
    services: string[]
  }>()

  appointments?.forEach((appt: any) => {
    const customerId = appt.customer_id
    const customerName = appt.profiles?.display_name || appt.profiles?.email || 'Unknown Customer'

    if (!customerMap.has(customerId)) {
      customerMap.set(customerId, {
        name: customerName,
        appointments: 0,
        revenue: 0,
        lastDate: appt.created_at,
        services: []
      })
    }

    const customer = customerMap.get(customerId)!
    customer.appointments += 1
    customer.revenue += 50 // Placeholder - would need to fetch actual pricing
    if (new Date(appt.created_at) > new Date(customer.lastDate)) {
      customer.lastDate = appt.created_at
    }
  })

  return Array.from(customerMap.entries())
    .map(([customerId, data]) => ({
      customer_id: customerId,
      customer_name: data.name,
      total_appointments: data.appointments,
      total_spent: data.revenue,
      last_appointment_date: data.lastDate,
      favorite_service: data.services[0] || 'N/A',
    }))
    .sort((a, b) => b.total_appointments - a.total_appointments)
    .slice(0, limit)
}

export async function getStaffEarningsSummary(
  staffId?: string,
  startDate?: string,
  endDate?: string
) {
  await requireAnyRole(ROLE_GROUPS.STAFF_USERS)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const targetStaffId = staffId || user.id
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const end = endDate || new Date().toISOString()

  const metrics = await getStaffPerformanceMetrics(targetStaffId, start, end)

  // Calculate commission (example: 40% of revenue)
  const commissionRate = 0.40
  const estimatedCommission = metrics.total_revenue * commissionRate

  return {
    total_revenue: metrics.total_revenue,
    estimated_commission: estimatedCommission,
    commission_rate: commissionRate * 100,
    completed_appointments: metrics.completed_appointments,
    avg_earning_per_appointment: metrics.avg_appointment_value * commissionRate,
    period_start: start,
    period_end: end,
  }
}
