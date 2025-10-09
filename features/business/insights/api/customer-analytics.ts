import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

/**
 * Calculate Customer Lifetime Value (CLV)
 */
export async function calculateCustomerLifetimeValue(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get all completed appointments for customer
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('id, start_time, end_time')
    .eq('customer_id', customerId)
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .order('start_time', { ascending: true })

  if (error) throw error

  if (!appointments || appointments.length === 0) {
    return {
      totalRevenue: 0,
      averageOrderValue: 0,
      visitCount: 0,
      lifetimeValue: 0,
      avgDaysBetweenVisits: 0,
      projectedLTV: 0,
    }
  }

  // Calculate total revenue (would need to join with payments/transactions)
  // For now, estimate based on appointment count
  const visitCount = appointments.length
  const avgSpendPerVisit = 75 // TODO: Calculate from actual transaction data

  const totalRevenue = visitCount * avgSpendPerVisit

  // Calculate average days between visits
  let totalDays = 0
  for (let i = 1; i < appointments.length; i++) {
    const prev = new Date(appointments[i - 1].start_time)
    const curr = new Date(appointments[i].start_time)
    totalDays += (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
  }
  const avgDaysBetweenVisits =
    appointments.length > 1 ? totalDays / (appointments.length - 1) : 0

  // Calculate customer tenure
  const firstVisit = new Date(appointments[0].start_time)
  const lastVisit = new Date(appointments[appointments.length - 1].start_time)
  const tenureDays = (lastVisit.getTime() - firstVisit.getTime()) / (1000 * 60 * 60 * 24)

  // Project future value (simple model: visits per year * avg spend * 3 years)
  const visitsPerYear = avgDaysBetweenVisits > 0 ? 365 / avgDaysBetweenVisits : visitCount
  const projectedLTV = visitsPerYear * avgSpendPerVisit * 3

  return {
    totalRevenue,
    averageOrderValue: avgSpendPerVisit,
    visitCount,
    lifetimeValue: totalRevenue,
    avgDaysBetweenVisits: Math.round(avgDaysBetweenVisits),
    tenureDays: Math.round(tenureDays),
    projectedLTV: Math.round(projectedLTV),
  }
}

/**
 * Get customer retention metrics
 */
export async function getRetentionMetrics(
  startDate: Date = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
  endDate: Date = new Date()
) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get customers who had appointments in the period
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('customer_id, start_time, status')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .gte('start_time', startDate.toISOString())
    .lte('start_time', endDate.toISOString())
    .order('start_time', { ascending: true })

  if (error) throw error

  if (!appointments || appointments.length === 0) {
    return {
      totalCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0,
      retentionRate: 0,
      churnRate: 0,
    }
  }

  // Group appointments by customer
  const customerVisits = new Map<string, Date[]>()
  for (const apt of appointments) {
    if (!customerVisits.has(apt.customer_id)) {
      customerVisits.set(apt.customer_id, [])
    }
    customerVisits.get(apt.customer_id)!.push(new Date(apt.start_time))
  }

  // Calculate metrics
  const totalCustomers = customerVisits.size
  const newCustomers = Array.from(customerVisits.values()).filter(
    (visits) => visits.length === 1
  ).length
  const returningCustomers = totalCustomers - newCustomers

  const retentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0
  const churnRate = 100 - retentionRate

  return {
    totalCustomers,
    newCustomers,
    returningCustomers,
    retentionRate: Math.round(retentionRate * 10) / 10,
    churnRate: Math.round(churnRate * 10) / 10,
  }
}

/**
 * Get customer cohort analysis
 */
export async function getCustomerCohorts() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get first visit date for each customer
  const { data: firstVisits, error: firstVisitsError } = await supabase
    .from('appointments')
    .select('customer_id, start_time')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .order('start_time', { ascending: true })

  if (firstVisitsError) throw firstVisitsError

  if (!firstVisits || firstVisits.length === 0) {
    return []
  }

  // Group customers by first visit month
  const cohortMap = new Map<
    string,
    {
      cohortMonth: string
      customers: Set<string>
      totalRevenue: number
    }
  >()

  for (const visit of firstVisits) {
    const cohortMonth = new Date(visit.start_time).toISOString().substring(0, 7) // YYYY-MM
    if (!cohortMap.has(cohortMonth)) {
      cohortMap.set(cohortMonth, {
        cohortMonth,
        customers: new Set(),
        totalRevenue: 0,
      })
    }
    cohortMap.get(cohortMonth)!.customers.add(visit.customer_id)
  }

  // Convert to array and calculate metrics
  const cohorts = Array.from(cohortMap.values()).map((cohort) => ({
    cohortMonth: cohort.cohortMonth,
    customerCount: cohort.customers.size,
    totalRevenue: cohort.totalRevenue,
  }))

  return cohorts.sort((a, b) => b.cohortMonth.localeCompare(a.cohortMonth))
}

/**
 * Get customer segmentation
 */
export async function getCustomerSegments() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get all customer appointments
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('customer_id, start_time, status')
    .eq('salon_id', salonId)
    .eq('status', 'completed')

  if (error) throw error

  if (!appointments || appointments.length === 0) {
    return {
      champions: 0,
      loyalCustomers: 0,
      potentialLoyalists: 0,
      newCustomers: 0,
      atRisk: 0,
      churned: 0,
    }
  }

  // Calculate RFM (Recency, Frequency, Monetary) for each customer
  const customerData = new Map<
    string,
    {
      lastVisit: Date
      visitCount: number
      firstVisit: Date
    }
  >()

  for (const apt of appointments) {
    const visitDate = new Date(apt.start_time)
    if (!customerData.has(apt.customer_id)) {
      customerData.set(apt.customer_id, {
        lastVisit: visitDate,
        visitCount: 1,
        firstVisit: visitDate,
      })
    } else {
      const data = customerData.get(apt.customer_id)!
      data.visitCount++
      if (visitDate > data.lastVisit) data.lastVisit = visitDate
      if (visitDate < data.firstVisit) data.firstVisit = visitDate
    }
  }

  const now = new Date()
  const segments = {
    champions: 0, // High frequency, recent visit
    loyalCustomers: 0, // High frequency, somewhat recent
    potentialLoyalists: 0, // Moderate frequency, recent
    newCustomers: 0, // Low frequency, recent
    atRisk: 0, // High frequency, not recent
    churned: 0, // Low frequency, not recent
  }

  for (const [_, data] of customerData) {
    const daysSinceLastVisit =
      (now.getTime() - data.lastVisit.getTime()) / (1000 * 60 * 60 * 24)

    const isRecent = daysSinceLastVisit <= 90
    const isHighFrequency = data.visitCount >= 5
    const isMediumFrequency = data.visitCount >= 3 && data.visitCount < 5
    const isNew = data.visitCount <= 2

    if (isHighFrequency && isRecent) {
      segments.champions++
    } else if (isHighFrequency && !isRecent && daysSinceLastVisit <= 180) {
      segments.loyalCustomers++
    } else if (isHighFrequency && daysSinceLastVisit > 180) {
      segments.atRisk++
    } else if (isMediumFrequency && isRecent) {
      segments.potentialLoyalists++
    } else if (isNew && isRecent) {
      segments.newCustomers++
    } else {
      segments.churned++
    }
  }

  return segments
}

/**
 * Get top customers by value
 */
export async function getTopCustomers(limit: number = 10) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get appointment counts per customer
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('customer_id, id')
    .eq('salon_id', salonId)
    .eq('status', 'completed')

  if (error) throw error

  if (!appointments || appointments.length === 0) {
    return []
  }

  // Count visits per customer
  const customerVisits = new Map<string, number>()
  for (const apt of appointments) {
    customerVisits.set(apt.customer_id, (customerVisits.get(apt.customer_id) || 0) + 1)
  }

  // Sort by visit count
  const topCustomerIds = Array.from(customerVisits.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([customerId, visitCount]) => ({
      customerId,
      visitCount,
    }))

  // Get customer details
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .in(
      'id',
      topCustomerIds.map((c) => c.customerId)
    )

  if (profileError) throw profileError

  // Combine data
  return topCustomerIds
    .map((item) => {
      const profile = profiles?.find((p) => p.id === item.customerId)
      return {
        id: item.customerId,
        name: profile?.full_name || 'Unknown',
        email: profile?.email || '',
        visitCount: item.visitCount,
        estimatedValue: item.visitCount * 75, // TODO: Calculate from actual data
      }
    })
    .filter((c) => c.name !== 'Unknown')
}
