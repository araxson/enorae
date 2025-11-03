import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { TIME_CONVERSIONS, CHURN_RISK_THRESHOLDS } from '@/lib/config/constants'

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
    ? (now.getTime() - lastVisit.getTime()) / TIME_CONVERSIONS.MS_PER_DAY
    : Infinity

  const cancelledCount = appointmentRecords.filter((a) => a.status === 'cancelled').length
  const noShowCount = appointmentRecords.filter((a) => a.status === 'no_show').length
  const totalVisits = completedAppointments.length

  // Calculate average days between visits
  let totalDays = 0
  for (let appointmentIndex = 1; appointmentIndex < completedWithDates.length; appointmentIndex++) {
    const previousStartTime = completedWithDates[appointmentIndex]?.start_time
    const currentStartTime = completedWithDates[appointmentIndex - 1]?.start_time
    if (previousStartTime && currentStartTime) {
      const previousDate = new Date(previousStartTime)
      const currentDate = new Date(currentStartTime)
      totalDays += (previousDate.getTime() - currentDate.getTime()) / TIME_CONVERSIONS.MS_PER_DAY
    }
  }
  const avgDaysBetweenVisits =
    completedWithDates.length > 1 ? totalDays / (completedWithDates.length - 1) : 0

  // Churn risk scoring
  let riskScore = 0
  const factors: string[] = []

  // Factor 1: Time since last visit
  if (daysSinceLastVisit > avgDaysBetweenVisits * CHURN_RISK_THRESHOLDS.OVERDUE_VISIT_MULTIPLIER && avgDaysBetweenVisits > 0) {
    riskScore += CHURN_RISK_THRESHOLDS.OVERDUE_RETURN_SCORE
    factors.push('Overdue for return visit')
  } else if (daysSinceLastVisit > avgDaysBetweenVisits * CHURN_RISK_THRESHOLDS.APPROACHING_RETURN_MULTIPLIER && avgDaysBetweenVisits > 0) {
    riskScore += CHURN_RISK_THRESHOLDS.APPROACHING_RETURN_SCORE
    factors.push('Approaching typical return window')
  } else if (daysSinceLastVisit > CHURN_RISK_THRESHOLDS.LONG_TIME_SINCE_VISIT_DAYS) {
    riskScore += CHURN_RISK_THRESHOLDS.LONG_TIME_SCORE
    factors.push('Long time since last visit')
  }

  // Factor 2: Cancellation rate
  const cancellationRate = totalVisits > 0 ? cancelledCount / totalVisits : 0
  if (cancellationRate > CHURN_RISK_THRESHOLDS.HIGH_CANCELLATION_RATE) {
    riskScore += CHURN_RISK_THRESHOLDS.HIGH_CANCELLATION_SCORE
    factors.push('High cancellation rate')
  } else if (cancellationRate > CHURN_RISK_THRESHOLDS.MODERATE_CANCELLATION_RATE) {
    riskScore += CHURN_RISK_THRESHOLDS.MODERATE_CANCELLATION_SCORE
    factors.push('Moderate cancellation rate')
  }

  // Factor 3: No-show rate
  const noShowRate = totalVisits > 0 ? noShowCount / totalVisits : 0
  if (noShowRate > CHURN_RISK_THRESHOLDS.HIGH_NO_SHOW_RATE) {
    riskScore += CHURN_RISK_THRESHOLDS.HIGH_NO_SHOW_SCORE
    factors.push('High no-show rate')
  } else if (noShowRate > CHURN_RISK_THRESHOLDS.MODERATE_NO_SHOW_RATE) {
    riskScore += CHURN_RISK_THRESHOLDS.MODERATE_NO_SHOW_SCORE
    factors.push('Some no-shows')
  }

  // Factor 4: Visit frequency declining
  if (completedWithDates.length >= CHURN_RISK_THRESHOLDS.MIN_VISITS_FOR_FREQUENCY) {
    const recentVisits = completedWithDates.slice(0, CHURN_RISK_THRESHOLDS.MIN_VISITS_FOR_FREQUENCY)
    let recentTotalDays = 0
    for (let visitIndex = 1; visitIndex < recentVisits.length; visitIndex++) {
      const previousVisitStartTime = recentVisits[visitIndex]?.start_time
      const currentVisitStartTime = recentVisits[visitIndex - 1]?.start_time
      if (previousVisitStartTime && currentVisitStartTime) {
        const previousVisitDate = new Date(previousVisitStartTime)
        const currentVisitDate = new Date(currentVisitStartTime)
        recentTotalDays += (previousVisitDate.getTime() - currentVisitDate.getTime()) / TIME_CONVERSIONS.MS_PER_DAY
      }
    }
    const recentAvg = recentTotalDays / (recentVisits.length - 1)

    if (avgDaysBetweenVisits > 0 && recentAvg > avgDaysBetweenVisits * CHURN_RISK_THRESHOLDS.FREQUENCY_DECLINE_MULTIPLIER) {
      riskScore += CHURN_RISK_THRESHOLDS.FREQUENCY_DECLINE_SCORE
      factors.push('Decreasing visit frequency')
    }
  }

  // Factor 5: Low total visits
  if (totalVisits < CHURN_RISK_THRESHOLDS.MIN_VISITS_FOR_FREQUENCY) {
    riskScore += CHURN_RISK_THRESHOLDS.LOW_VISITS_SCORE
    factors.push('New customer with few visits')
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical'
  let recommendation: string

  if (riskScore >= CHURN_RISK_THRESHOLDS.CRITICAL_RISK_SCORE) {
    riskLevel = 'critical'
    recommendation =
      'Immediate action required: Reach out with personalized offer or exclusive promotion'
  } else if (riskScore >= CHURN_RISK_THRESHOLDS.HIGH_RISK_SCORE) {
    riskLevel = 'high'
    recommendation = 'High risk: Send re-engagement campaign with special incentive'
  } else if (riskScore >= CHURN_RISK_THRESHOLDS.MEDIUM_RISK_SCORE) {
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
