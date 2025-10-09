import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

export interface CustomerMetrics {
  customer_id: string
  customer_name: string
  customer_email: string
  first_visit_date: string
  last_visit_date: string
  total_visits: number
  total_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  no_show_appointments: number
  cancellation_rate: number
  no_show_rate: number
  review_count: number
  average_rating: number
  total_services: number
  favorite_service_name: string
  favorite_staff_name: string
  lifetime_value: number
  segment: 'VIP' | 'Loyal' | 'Regular' | 'At Risk' | 'New' | 'Churned'
}

export interface CustomerSegmentation {
  vip: number
  loyal: number
  regular: number
  at_risk: number
  new: number
  churned: number
}

export interface InsightsSummary {
  total_customers: number
  active_customers: number
  avg_lifetime_value: number
  avg_visits_per_customer: number
  retention_rate: number
  churn_rate: number
  segmentation: CustomerSegmentation
}

function calculateSegment(metrics: {
  total_visits: number
  last_visit_date: string
  lifetime_value: number
  cancellation_rate: number
}): CustomerMetrics['segment'] {
  const daysSinceLastVisit = Math.floor(
    (Date.now() - new Date(metrics.last_visit_date).getTime()) / (1000 * 60 * 60 * 24)
  )

  // Churned: No visit in 90+ days
  if (daysSinceLastVisit > 90) return 'Churned'

  // New: 1-2 visits
  if (metrics.total_visits <= 2) return 'New'

  // VIP: 10+ visits and high LTV
  if (metrics.total_visits >= 10 && metrics.lifetime_value >= 1000) return 'VIP'

  // Loyal: 5+ visits
  if (metrics.total_visits >= 5) return 'Loyal'

  // At Risk: 3+ visits but 45+ days since last visit or high cancellation rate
  if (metrics.total_visits >= 3 && (daysSinceLastVisit > 45 || metrics.cancellation_rate > 20)) {
    return 'At Risk'
  }

  // Regular: Everything else
  return 'Regular'
}

export async function getCustomerInsights(limit = 50): Promise<CustomerMetrics[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get all customers who have visited this salon
  const { data: appointments, error: apptError } = await supabase
    .from('appointments')
    .select(`
      customer_id,
      created_at,
      status,
      profiles:customer_id (
        display_name,
        email
      )
    `)
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })

  if (apptError) throw apptError

  // Group by customer
  const customerMap = new Map<string, {
    name: string
    email: string
    appointments: any[]
  }>()

  appointments?.forEach((appt) => {
    const customerId = appt.customer_id
    if (!customerMap.has(customerId)) {
      customerMap.set(customerId, {
        name: appt.profiles?.display_name || 'Unknown',
        email: appt.profiles?.email || '',
        appointments: [],
      })
    }
    customerMap.get(customerId)!.appointments.push(appt)
  })

  // Calculate metrics for each customer
  const customerMetrics: CustomerMetrics[] = []

  for (const [customerId, data] of customerMap.entries()) {
    const appts = data.appointments
    const completedAppts = appts.filter(a => a.status === 'completed')
    const cancelledAppts = appts.filter(a => a.status === 'cancelled')
    const noShowAppts = appts.filter(a => a.status === 'no_show')

    const firstVisit = appts[appts.length - 1]?.created_at
    const lastVisit = appts[0]?.created_at
    const totalVisits = completedAppts.length

    // Call analytics functions for detailed stats
    const { data: visitStats } = await supabase.rpc('calculate_customer_visit_stats', {
      p_customer_id: customerId,
      p_salon_id: salonId,
    })

    const { data: rates } = await supabase.rpc('calculate_customer_rates', {
      p_customer_id: customerId,
      p_salon_id: salonId,
    })

    const { data: reviewStats } = await supabase.rpc('calculate_customer_review_stats', {
      p_customer_id: customerId,
      p_salon_id: salonId,
    })

    const { data: serviceStats } = await supabase.rpc('calculate_customer_service_stats', {
      p_customer_id: customerId,
      p_salon_id: salonId,
    })

    const { data: favoriteStaffId } = await supabase.rpc('calculate_customer_favorite_staff', {
      p_customer_id: customerId,
      p_salon_id: salonId,
    })

    // Get favorite service and staff names
    let favoriteServiceName = 'N/A'
    let favoriteStaffName = 'N/A'

    if (serviceStats?.[0]?.favorite_service_id) {
      const { data: service } = await supabase
        .from('services')
        .select('name')
        .eq('id', serviceStats[0].favorite_service_id)
        .single()
      favoriteServiceName = service?.name || 'N/A'
    }

    if (favoriteStaffId) {
      const { data: staff } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', favoriteStaffId)
        .single()
      favoriteStaffName = staff?.display_name || 'N/A'
    }

    // Calculate LTV (average $75 per visit)
    const lifetimeValue = totalVisits * 75

    const metrics = {
      customer_id: customerId,
      customer_name: data.name,
      customer_email: data.email,
      first_visit_date: firstVisit || new Date().toISOString(),
      last_visit_date: lastVisit || new Date().toISOString(),
      total_visits: visitStats?.[0]?.total_visits || totalVisits,
      total_appointments: visitStats?.[0]?.total_appointments || appts.length,
      completed_appointments: visitStats?.[0]?.completed_appointments || completedAppts.length,
      cancelled_appointments: visitStats?.[0]?.cancelled_appointments || cancelledAppts.length,
      no_show_appointments: visitStats?.[0]?.no_show_appointments || noShowAppts.length,
      cancellation_rate: rates?.[0]?.cancellation_rate || 0,
      no_show_rate: rates?.[0]?.no_show_rate || 0,
      review_count: reviewStats?.[0]?.review_count || 0,
      average_rating: reviewStats?.[0]?.average_rating || 0,
      total_services: serviceStats?.[0]?.total_services || 0,
      favorite_service_name: favoriteServiceName,
      favorite_staff_name: favoriteStaffName,
      lifetime_value: lifetimeValue,
      segment: 'Regular' as const,
    }

    metrics.segment = calculateSegment(metrics)
    customerMetrics.push(metrics)
  }

  // Sort by LTV and return top customers
  return customerMetrics
    .sort((a, b) => b.lifetime_value - a.lifetime_value)
    .slice(0, limit)
}

export async function getInsightsSummary(): Promise<InsightsSummary> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('customer_id, status, created_at')
    .eq('salon_id', salonId)

  if (!appointments) {
    return {
      total_customers: 0,
      active_customers: 0,
      avg_lifetime_value: 0,
      avg_visits_per_customer: 0,
      retention_rate: 0,
      churn_rate: 0,
      segmentation: {
        vip: 0,
        loyal: 0,
        regular: 0,
        at_risk: 0,
        new: 0,
        churned: 0,
      },
    }
  }

  const customerMetrics = await getCustomerInsights(1000)

  const totalCustomers = new Set(appointments.map(a => a.customer_id)).size
  const activeCustomers = customerMetrics.filter(
    c => c.segment !== 'Churned'
  ).length

  const totalLTV = customerMetrics.reduce((sum, c) => sum + c.lifetime_value, 0)
  const avgLTV = totalCustomers > 0 ? totalLTV / totalCustomers : 0

  const totalVisits = customerMetrics.reduce((sum, c) => sum + c.total_visits, 0)
  const avgVisits = totalCustomers > 0 ? totalVisits / totalCustomers : 0

  const retentionRate = totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0
  const churnRate = 100 - retentionRate

  const segmentation: CustomerSegmentation = {
    vip: customerMetrics.filter(c => c.segment === 'VIP').length,
    loyal: customerMetrics.filter(c => c.segment === 'Loyal').length,
    regular: customerMetrics.filter(c => c.segment === 'Regular').length,
    at_risk: customerMetrics.filter(c => c.segment === 'At Risk').length,
    new: customerMetrics.filter(c => c.segment === 'New').length,
    churned: customerMetrics.filter(c => c.segment === 'Churned').length,
  }

  return {
    total_customers: totalCustomers,
    active_customers: activeCustomers,
    avg_lifetime_value: avgLTV,
    avg_visits_per_customer: avgVisits,
    retention_rate: retentionRate,
    churn_rate: churnRate,
    segmentation,
  }
}

export async function getCustomersBySegment(segment: CustomerMetrics['segment']) {
  const allCustomers = await getCustomerInsights(1000)
  return allCustomers.filter(c => c.segment === segment)
}
