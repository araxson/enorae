import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

/**
 * Predict customer churn risk
 */
export async function predictChurnRisk(customerId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get customer appointment history
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('id, start_time, status')
    .eq('customer_id', customerId)
    .eq('salon_id', salonId)
    .order('start_time', { ascending: false })

  if (error) throw error

  if (!appointments || appointments.length === 0) {
    return {
      riskLevel: 'unknown',
      riskScore: 0,
      factors: [],
      recommendation: 'No appointment history available',
    }
  }

  const now = new Date()
  const completedAppointments = appointments.filter((a) => a.status === 'completed')

  // Calculate churn factors
  const lastVisit = completedAppointments[0]
    ? new Date(completedAppointments[0].start_time)
    : null
  const daysSinceLastVisit = lastVisit
    ? (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
    : Infinity

  const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length
  const noShowCount = appointments.filter((a) => a.status === 'no_show').length
  const totalVisits = completedAppointments.length

  // Calculate average days between visits
  let totalDays = 0
  for (let i = 1; i < completedAppointments.length; i++) {
    const prev = new Date(completedAppointments[i].start_time)
    const curr = new Date(completedAppointments[i - 1].start_time)
    totalDays += (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
  }
  const avgDaysBetweenVisits =
    completedAppointments.length > 1 ? totalDays / (completedAppointments.length - 1) : 0

  // Churn risk scoring
  let riskScore = 0
  const factors: string[] = []

  // Factor 1: Time since last visit
  if (daysSinceLastVisit > avgDaysBetweenVisits * 2 && avgDaysBetweenVisits > 0) {
    riskScore += 30
    factors.push('Overdue for return visit')
  } else if (daysSinceLastVisit > avgDaysBetweenVisits * 1.5 && avgDaysBetweenVisits > 0) {
    riskScore += 20
    factors.push('Approaching typical return window')
  } else if (daysSinceLastVisit > 90) {
    riskScore += 25
    factors.push('Long time since last visit')
  }

  // Factor 2: Cancellation rate
  const cancellationRate = totalVisits > 0 ? cancelledCount / totalVisits : 0
  if (cancellationRate > 0.3) {
    riskScore += 25
    factors.push('High cancellation rate')
  } else if (cancellationRate > 0.15) {
    riskScore += 15
    factors.push('Moderate cancellation rate')
  }

  // Factor 3: No-show rate
  const noShowRate = totalVisits > 0 ? noShowCount / totalVisits : 0
  if (noShowRate > 0.2) {
    riskScore += 20
    factors.push('High no-show rate')
  } else if (noShowRate > 0.1) {
    riskScore += 10
    factors.push('Some no-shows')
  }

  // Factor 4: Visit frequency declining
  if (completedAppointments.length >= 3) {
    const recentVisits = completedAppointments.slice(0, 3)
    let recentTotalDays = 0
    for (let i = 1; i < recentVisits.length; i++) {
      const prev = new Date(recentVisits[i].start_time)
      const curr = new Date(recentVisits[i - 1].start_time)
      recentTotalDays += (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
    }
    const recentAvg = recentTotalDays / (recentVisits.length - 1)

    if (avgDaysBetweenVisits > 0 && recentAvg > avgDaysBetweenVisits * 1.3) {
      riskScore += 15
      factors.push('Decreasing visit frequency')
    }
  }

  // Factor 5: Low total visits
  if (totalVisits < 3) {
    riskScore += 10
    factors.push('New customer with few visits')
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical'
  let recommendation: string

  if (riskScore >= 70) {
    riskLevel = 'critical'
    recommendation =
      'Immediate action required: Reach out with personalized offer or exclusive promotion'
  } else if (riskScore >= 50) {
    riskLevel = 'high'
    recommendation = 'High risk: Send re-engagement campaign with special incentive'
  } else if (riskScore >= 30) {
    riskLevel = 'medium'
    recommendation = 'Medium risk: Send reminder or check-in message'
  } else {
    riskLevel = 'low'
    recommendation = 'Low risk: Continue regular engagement'
  }

  return {
    riskLevel,
    riskScore,
    factors,
    recommendation,
    daysSinceLastVisit: Math.round(daysSinceLastVisit),
    avgDaysBetweenVisits: Math.round(avgDaysBetweenVisits),
    totalVisits,
    cancellationRate: Math.round(cancellationRate * 100),
    noShowRate: Math.round(noShowRate * 100),
  }
}

/**
 * Get customers at risk of churning
 */
export async function getAtRiskCustomers(limit: number = 20) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get recent completed appointments
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('customer_id, start_time, status')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .gte(
      'start_time',
      new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
    )

  if (error) throw error

  if (!appointments || appointments.length === 0) {
    return []
  }

  // Group by customer and find last visit
  const customerLastVisit = new Map<string, Date>()
  const customerVisitCount = new Map<string, number>()

  for (const apt of appointments) {
    const visitDate = new Date(apt.start_time)
    if (
      !customerLastVisit.has(apt.customer_id) ||
      visitDate > customerLastVisit.get(apt.customer_id)!
    ) {
      customerLastVisit.set(apt.customer_id, visitDate)
    }
    customerVisitCount.set(
      apt.customer_id,
      (customerVisitCount.get(apt.customer_id) || 0) + 1
    )
  }

  const now = new Date()
  const atRiskCustomers: Array<{
    customerId: string
    daysSinceLastVisit: number
    visitCount: number
  }> = []

  // Identify at-risk customers (haven't visited in 60+ days but visited within last 180 days)
  for (const [customerId, lastVisit] of customerLastVisit) {
    const daysSinceLastVisit = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceLastVisit >= 60 && daysSinceLastVisit <= 180) {
      atRiskCustomers.push({
        customerId,
        daysSinceLastVisit: Math.round(daysSinceLastVisit),
        visitCount: customerVisitCount.get(customerId) || 0,
      })
    }
  }

  // Sort by days since last visit (descending)
  atRiskCustomers.sort((a, b) => b.daysSinceLastVisit - a.daysSinceLastVisit)

  // Get customer details
  const customerIds = atRiskCustomers.slice(0, limit).map((c) => c.customerId)
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone')
    .in('id', customerIds)

  if (profileError) throw profileError

  return atRiskCustomers.slice(0, limit).map((item) => {
    const profile = profiles?.find((p) => p.id === item.customerId)
    return {
      id: item.customerId,
      name: profile?.full_name || 'Unknown',
      email: profile?.email || '',
      phone: profile?.phone || '',
      daysSinceLastVisit: item.daysSinceLastVisit,
      visitCount: item.visitCount,
    }
  })
}

/**
 * Get customer reactivation opportunities
 */
export async function getReactivationOpportunities() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get customers with last visit between 90-365 days ago (churned but recoverable)
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('customer_id, start_time')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .gte(
      'start_time',
      new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
    )
    .lte(
      'start_time',
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    )

  if (error) throw error

  if (!appointments || appointments.length === 0) {
    return {
      totalOpportunities: 0,
      customers: [],
    }
  }

  // Find customers with their last visit in this range
  const customerLastVisit = new Map<string, Date>()
  for (const apt of appointments) {
    const visitDate = new Date(apt.start_time)
    if (
      !customerLastVisit.has(apt.customer_id) ||
      visitDate > customerLastVisit.get(apt.customer_id)!
    ) {
      customerLastVisit.set(apt.customer_id, visitDate)
    }
  }

  // Get profiles
  const customerIds = Array.from(customerLastVisit.keys())
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .in('id', customerIds)

  if (profileError) throw profileError

  const now = new Date()
  const customers = customerIds.map((customerId) => {
    const lastVisit = customerLastVisit.get(customerId)!
    const profile = profiles?.find((p) => p.id === customerId)
    const daysSinceLastVisit = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)

    return {
      id: customerId,
      name: profile?.full_name || 'Unknown',
      email: profile?.email || '',
      daysSinceLastVisit: Math.round(daysSinceLastVisit),
      lastVisit: lastVisit.toISOString(),
    }
  })

  return {
    totalOpportunities: customers.length,
    customers: customers.sort((a, b) => a.daysSinceLastVisit - b.daysSinceLastVisit),
  }
}
