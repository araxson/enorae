import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability/logger'

type AppointmentSummary = {
  id: string
  customer_id?: string
  start_time: string | null
  status: string | null
}

/**
 * Predict customer churn risk
 */
export async function predictChurnRisk(customerId: string) {
  const logger = createOperationLogger('predictChurnRisk', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get customer appointment history
  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select('id, start_time, status')
    .eq('customer_id', customerId)
    .eq('salon_id', salonId || '')
    .order('start_time', { ascending: false })

  if (error) throw error

  const appointmentRecords = (appointments ?? []) as AppointmentSummary[]

  if (appointmentRecords.length === 0) {
    return {
      riskLevel: 'unknown',
      riskScore: 0,
      factors: [],
      recommendation: 'No appointment history available',
    }
  }

  const now = new Date()
  const completedAppointments = appointmentRecords.filter((a) => a.status === 'completed')
  const completedWithDates = completedAppointments.filter(
    (apt): apt is typeof apt & { start_time: string } => Boolean(apt.start_time)
  )

  // Calculate churn factors - use optional chaining for array access
  const lastVisit = completedWithDates.length > 0 && completedWithDates[0]
    ? new Date(completedWithDates[0].start_time)
    : null
  const daysSinceLastVisit = lastVisit
    ? (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
    : Infinity

  const cancelledCount = appointmentRecords.filter((a) => a.status === 'cancelled').length
  const noShowCount = appointmentRecords.filter((a) => a.status === 'no_show').length
  const totalVisits = completedAppointments.length

  // Calculate average days between visits
  let totalDays = 0
  for (let i = 1; i < completedWithDates.length; i++) {
    const prevStartTime = completedWithDates[i]?.start_time
    const currStartTime = completedWithDates[i - 1]?.start_time
    if (prevStartTime && currStartTime) {
      const prev = new Date(prevStartTime)
      const curr = new Date(currStartTime)
      totalDays += (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
    }
  }
  const avgDaysBetweenVisits =
    completedWithDates.length > 1 ? totalDays / (completedWithDates.length - 1) : 0

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
  if (completedWithDates.length >= 3) {
    const recentVisits = completedWithDates.slice(0, 3)
    let recentTotalDays = 0
    for (let i = 1; i < recentVisits.length; i++) {
      const prevStartTime = recentVisits[i]?.start_time
      const currStartTime = recentVisits[i - 1]?.start_time
      if (prevStartTime && currStartTime) {
        const prev = new Date(prevStartTime)
        const curr = new Date(currStartTime)
        recentTotalDays += (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
      }
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
