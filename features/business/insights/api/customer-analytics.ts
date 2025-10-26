import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

type AppointmentSummary = {
  id: string
  customer_id: string
  start_time: string | null
  end_time?: string | null
  status?: string | null
}

type ProfileSummary = {
  id: string
  full_name: string | null
  email?: string | null
}

type PaymentRecord = {
  appointment_id: string | null
  customer_id: string | null
  amount: number | null
  transaction_type: string | null
}

/**
 * Calculate Customer Lifetime Value (CLV)
 */
export async function calculateCustomerLifetimeValue(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get all completed appointments for customer with total_price
  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select('id, start_time, end_time')
    .eq('customer_id', customerId)
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .order('start_time', { ascending: true })

  if (error) throw error

  const appointmentRows = (appointments ?? []) as AppointmentSummary[]

  const { data: payments, error: paymentsError } = await supabase
    .from('manual_transactions_view')
    .select('appointment_id, amount, transaction_type, customer_id')
    .eq('salon_id', salonId)
    .eq('customer_id', customerId)
    .eq('transaction_type', 'payment')

  if (paymentsError) throw paymentsError

  const paymentRows = (payments ?? []) as PaymentRecord[]
  const revenueByAppointment = new Map<string, number>()
  let uncategorizedRevenue = 0

  for (const payment of paymentRows) {
    const amount = Number(payment.amount ?? 0)
    if (!amount) continue
    if (payment.appointment_id) {
      revenueByAppointment.set(
        payment.appointment_id,
        (revenueByAppointment.get(payment.appointment_id) ?? 0) + amount
      )
    } else {
      uncategorizedRevenue += amount
    }
  }

  if (appointmentRows.length === 0) {
    return {
      totalRevenue: 0,
      averageOrderValue: 0,
      visitCount: 0,
      lifetimeValue: 0,
      avgDaysBetweenVisits: 0,
      projectedLTV: 0,
    }
  }

  // Calculate total revenue from actual appointment prices
  const visitCount = appointmentRows.length
  const totalRevenue =
    appointmentRows.reduce(
      (sum, apt) => sum + (revenueByAppointment.get(apt.id) ?? 0),
      0
    ) + uncategorizedRevenue
  const avgSpendPerVisit = visitCount > 0 ? totalRevenue / visitCount : 0

  // Calculate average days between visits
  let totalDays = 0
  for (let i = 1; i < appointmentRows.length; i++) {
    const prevStart = appointmentRows[i - 1]?.start_time
    const currStart = appointmentRows[i]?.start_time
    if (!prevStart || !currStart) continue
    const prev = new Date(prevStart)
    const curr = new Date(currStart)
    totalDays += (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
  }
  const avgDaysBetweenVisits =
    appointmentRows.length > 1 ? totalDays / (appointmentRows.length - 1) : 0

  // Calculate customer tenure
  const firstVisitStart = appointmentRows[0]?.start_time
  const lastVisitStart = appointmentRows[appointmentRows.length - 1]?.start_time
  const firstVisit = firstVisitStart ? new Date(firstVisitStart) : new Date()
  const lastVisit = lastVisitStart ? new Date(lastVisitStart) : new Date()
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
    .from('appointments_view')
    .select('customer_id, start_time, status')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .gte('start_time', startDate.toISOString())
    .lte('start_time', endDate.toISOString())
    .order('start_time', { ascending: true })

  if (error) throw error

  const appointmentRows = (appointments ?? []) as AppointmentSummary[]

  if (appointmentRows.length === 0) {
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
  for (const apt of appointmentRows) {
    if (!apt.start_time) continue
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
    .from('appointments_view')
    .select('customer_id, start_time')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .order('start_time', { ascending: true })

  if (firstVisitsError) throw firstVisitsError

  const firstVisitRows = (firstVisits ?? []) as AppointmentSummary[]

  if (firstVisitRows.length === 0) {
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

  for (const visit of firstVisitRows) {
    if (!visit.start_time) continue
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
    .from('appointments_view')
    .select('customer_id, start_time, status')
    .eq('salon_id', salonId)
    .eq('status', 'completed')

  if (error) throw error

  const appointmentRows = (appointments ?? []) as AppointmentSummary[]

  if (appointmentRows.length === 0) {
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

  for (const apt of appointmentRows) {
    if (!apt.start_time) continue
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

  // Get appointment counts and revenue per customer
  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select('customer_id, id')
    .eq('salon_id', salonId)
    .eq('status', 'completed')

  if (error) throw error

  const appointmentRows = (appointments ?? []) as AppointmentSummary[]

  const { data: payments, error: paymentsError } = await supabase
    .from('manual_transactions_view')
    .select('customer_id, amount, transaction_type')
    .eq('salon_id', salonId)
    .eq('transaction_type', 'payment')

  if (paymentsError) throw paymentsError

  const revenueByCustomer = new Map<string, number>()
  ;((payments ?? []) as PaymentRecord[]).forEach((payment) => {
    if (!payment.customer_id) return
    const amount = Number(payment.amount ?? 0)
    if (!amount) return
    revenueByCustomer.set(
      payment.customer_id,
      (revenueByCustomer.get(payment.customer_id) ?? 0) + amount
    )
  })

  if (appointmentRows.length === 0) {
    return []
  }

  // Count visits and calculate revenue per customer
  const customerData = new Map<string, { visitCount: number; totalRevenue: number }>()
  for (const apt of appointmentRows) {
    const data = customerData.get(apt.customer_id) || { visitCount: 0, totalRevenue: 0 }
    data.visitCount++
    customerData.set(apt.customer_id, data)
  }

  for (const [customerId, amount] of revenueByCustomer.entries()) {
    const data = customerData.get(customerId) || { visitCount: 0, totalRevenue: 0 }
    data.totalRevenue += amount
    customerData.set(customerId, data)
  }

  // Sort by visit count
  const topCustomerIds = Array.from(customerData.entries())
    .sort((a, b) => b[1].visitCount - a[1].visitCount)
    .slice(0, limit)
    .map(([customerId, data]) => ({
      customerId,
      visitCount: data.visitCount,
      totalRevenue: data.totalRevenue,
    }))

  // Get customer details
  const { data: profiles, error: profileError } = await supabase
    .from('profiles_view')
    .select('id, full_name, email')
    .in(
      'id',
      topCustomerIds.map((c) => c.customerId)
    )

  if (profileError) throw profileError

  const profileRows = (profiles ?? []) as Array<ProfileSummary>

  // Combine data
  return topCustomerIds
    .map((item) => {
      const profile = profileRows.find((p) => p.id === item.customerId)
      return {
        id: item.customerId,
        name: profile?.full_name || 'Unknown',
        email: profile?.email || '',
        visitCount: item.visitCount,
        estimatedValue: item.totalRevenue,
      }
    })
    .filter((c) => c.name !== 'Unknown')
}
