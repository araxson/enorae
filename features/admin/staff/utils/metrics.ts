export type BackgroundStatus = 'clear' | 'pending' | 'failed' | 'missing'
export type ComplianceStatus = 'compliant' | 'warning' | 'critical'

export interface PerformanceSnapshot {
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  noShowAppointments: number
  flaggedReviews: number
  averageRating: number | null
}

export interface ComplianceInput extends PerformanceSnapshot {
  backgroundCheckStatus: BackgroundStatus
  certificationsCount: number
}

export interface ComplianceOutcome {
  score: number
  status: ComplianceStatus
  issues: string[]
  completionRate: number
  noShowRate: number
  cancellationRate: number
  flaggedRate: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Normalise raw background status values coming from Supabase or external vendors.
 */
export function normalizeBackgroundStatus(status?: string | null): BackgroundStatus {
  if (!status) return 'missing'
  const normalized = status.toLowerCase()

  if (['clear', 'passed', 'approved', 'complete'].includes(normalized)) {
    return 'clear'
  }

  if (['pending', 'processing', 'in_progress'].includes(normalized)) {
    return 'pending'
  }

  if (['failed', 'rejected', 'flagged'].includes(normalized)) {
    return 'failed'
  }

  return 'missing'
}

/**
 * Calculate completion / cancellation / no-show rates with safe divisors.
 */
export function calculatePerformanceRates(snapshot: PerformanceSnapshot) {
  const { totalAppointments, completedAppointments, cancelledAppointments, noShowAppointments } = snapshot
  const safeTotal = Math.max(totalAppointments, 1)

  return {
    completionRate: completedAppointments / safeTotal,
    cancellationRate: cancelledAppointments / safeTotal,
    noShowRate: noShowAppointments / safeTotal,
  }
}

/**
 * Compute a compliance score (0-100) with associated issues and risk tier.
 */
export function calculateComplianceScore(input: ComplianceInput): ComplianceOutcome {
  const {
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    flaggedReviews,
    averageRating,
    backgroundCheckStatus,
    certificationsCount,
  } = input

  const { completionRate, cancellationRate, noShowRate } = calculatePerformanceRates({
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    flaggedReviews,
    averageRating,
  })

  const issues: string[] = []
  let score = 70 // start with a neutral baseline

  switch (backgroundCheckStatus) {
    case 'clear':
      score += 10
      break
    case 'pending':
      issues.push('Background check pending')
      score -= 15
      break
    case 'failed':
      issues.push('Background check failed')
      score -= 35
      break
    case 'missing':
      issues.push('Background check missing')
      score -= 25
      break
  }

  if (certificationsCount > 0) {
    score += Math.min(certificationsCount * 2.5, 10)
  } else {
    issues.push('No active certifications on file')
    score -= 10
  }

  const flaggedRate = totalAppointments > 0 ? flaggedReviews / totalAppointments : 0
  if (flaggedRate > 0.2) {
    issues.push('High proportion of flagged reviews')
    score -= 20
  } else if (flaggedRate > 0.1) {
    issues.push('Flagged reviews require attention')
    score -= 10
  } else if (flaggedReviews === 0 && totalAppointments > 5) {
    score += 5
  }

  if (completionRate >= 0.85) {
    score += 5
  } else if (completionRate < 0.7) {
    issues.push('Low appointment completion rate')
    score -= 12
  }

  if (noShowRate > 0.12) {
    issues.push('Elevated no-show rate')
    score -= 12
  } else if (noShowRate < 0.05 && totalAppointments > 5) {
    score += 3
  }

  if (cancellationRate > 0.15) {
    issues.push('Frequent cancellations')
    score -= 8
  }

  if (typeof averageRating === 'number') {
    if (averageRating >= 4.5) {
      score += 6
    } else if (averageRating < 3.2) {
      issues.push('Customer satisfaction below target')
      score -= 15
    } else if (averageRating < 3.7) {
      issues.push('Customer satisfaction drifting')
      score -= 7
    }
  }

  const finalScore = clamp(Math.round(score), 0, 100)
  let status: ComplianceStatus = 'compliant'

  if (finalScore < 60) {
    status = 'critical'
  } else if (finalScore < 80) {
    status = 'warning'
  }

  return {
    score: finalScore,
    status,
    issues,
    completionRate,
    noShowRate,
    cancellationRate,
    flaggedRate,
  }
}

/**
 * Derive a short qualitative label for reporting badging.
 */
export function deriveRiskLabel(status: ComplianceStatus): 'low' | 'medium' | 'high' {
  if (status === 'critical') return 'high'
  if (status === 'warning') return 'medium'
  return 'low'
}
