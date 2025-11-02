import 'server-only'

import { differenceInCalendarDays } from 'date-fns'
import { createOperationLogger } from '@/lib/observability'

export type LicenseStatus = 'valid' | 'expiring' | 'expired' | 'unknown'
export type ComplianceLevel = 'low' | 'medium' | 'high'

// Compliance score constants
const COMPLIANCE_SCORE_BASE = 80
const COMPLIANCE_SCORE_UNVERIFIED_PENALTY = 20
const COMPLIANCE_SCORE_EXPIRED_LICENSE_PENALTY = 25
const COMPLIANCE_SCORE_EXPIRING_LICENSE_PENALTY = 10
const COMPLIANCE_SCORE_UNKNOWN_LICENSE_PENALTY = 5
const COMPLIANCE_SCORE_LOW_RATING_PENALTY = 10
const COMPLIANCE_SCORE_HIGH_RATING_BONUS = 5
const COMPLIANCE_SCORE_LOW_BOOKINGS_PENALTY = 5

// Compliance thresholds
const MINIMUM_RATING_THRESHOLD = 3
const EXCELLENT_RATING_THRESHOLD = 4.5
const MINIMUM_BOOKINGS_THRESHOLD = 5
const COMPLIANCE_HIGH_RISK_THRESHOLD = 60
const COMPLIANCE_MEDIUM_RISK_THRESHOLD = 80

// Health score constants
const MAXIMUM_RATING_SCORE = 5
const BOOKINGS_NORMALIZATION_THRESHOLD = 200
const REVENUE_NORMALIZATION_THRESHOLD = 150000
const STAFF_NORMALIZATION_THRESHOLD = 50

// Health score weights
const RATING_WEIGHT = 0.35
const BOOKINGS_WEIGHT = 0.25
const REVENUE_WEIGHT = 0.3
const STAFF_WEIGHT = 0.1

// License expiration constants
const LICENSE_EXPIRING_SOON_DAYS = 30
const SCORE_MIN = 0
const SCORE_MAX = 100
const PERCENTAGE_MULTIPLIER = 100

interface ComplianceInput {
  isVerified: boolean
  licenseStatus: LicenseStatus
  ratingAverage: number | null
  totalBookings: number | null
  totalRevenue: number | null
  staffCount: number | null
}

interface ComplianceResult {
  score: number
  level: ComplianceLevel
  issues: string[]
}

interface HealthInput {
  ratingAverage: number | null
  totalBookings: number | null
  totalRevenue: number | null
  staffCount: number | null
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function computeCompliance(input: ComplianceInput): ComplianceResult {
  const issues: string[] = []
  let score = COMPLIANCE_SCORE_BASE

  if (!input.isVerified) {
    issues.push('Verification pending')
    score -= COMPLIANCE_SCORE_UNVERIFIED_PENALTY
  }

  switch (input.licenseStatus) {
    case 'expired':
      issues.push('License expired')
      score -= COMPLIANCE_SCORE_EXPIRED_LICENSE_PENALTY
      break
    case 'expiring':
      issues.push('License expiring soon')
      score -= COMPLIANCE_SCORE_EXPIRING_LICENSE_PENALTY
      break
    case 'unknown':
      issues.push('License status unknown')
      score -= COMPLIANCE_SCORE_UNKNOWN_LICENSE_PENALTY
      break
  }

  if ((input.ratingAverage ?? 0) < MINIMUM_RATING_THRESHOLD) {
    issues.push('Low customer rating')
    score -= COMPLIANCE_SCORE_LOW_RATING_PENALTY
  } else if ((input.ratingAverage ?? 0) > EXCELLENT_RATING_THRESHOLD) {
    score += COMPLIANCE_SCORE_HIGH_RATING_BONUS
  }

  if ((input.totalBookings ?? 0) < MINIMUM_BOOKINGS_THRESHOLD) {
    issues.push('Low booking volume')
    score -= COMPLIANCE_SCORE_LOW_BOOKINGS_PENALTY
  }

  const finalScore = clamp(Math.round(score), SCORE_MIN, SCORE_MAX)
  let level: ComplianceLevel = 'low'

  if (finalScore < COMPLIANCE_HIGH_RISK_THRESHOLD) level = 'high'
  else if (finalScore < COMPLIANCE_MEDIUM_RISK_THRESHOLD) level = 'medium'

  return { score: finalScore, level, issues }
}

export function calculateHealthScore({
  ratingAverage,
  totalBookings,
  totalRevenue,
  staffCount,
}: HealthInput): number {
  const ratingScore = clamp((ratingAverage ?? 0) / MAXIMUM_RATING_SCORE, 0, 1)
  const bookingScore = clamp((totalBookings ?? 0) / BOOKINGS_NORMALIZATION_THRESHOLD, 0, 1)
  const revenueScore = clamp((totalRevenue ?? 0) / REVENUE_NORMALIZATION_THRESHOLD, 0, 1)
  const staffScore = clamp((staffCount ?? 0) / STAFF_NORMALIZATION_THRESHOLD, 0, 1)

  const weighted =
    ratingScore * RATING_WEIGHT + bookingScore * BOOKINGS_WEIGHT + revenueScore * REVENUE_WEIGHT + staffScore * STAFF_WEIGHT
  return Math.round(weighted * PERCENTAGE_MULTIPLIER)
}

export function deriveLicenseStatus(expiresAt: string | null): { status: LicenseStatus; days: number | null } {
  if (!expiresAt) return { status: 'unknown', days: null }
  const days = differenceInCalendarDays(new Date(expiresAt), new Date())
  if (days < 0) return { status: 'expired', days }
  if (days <= LICENSE_EXPIRING_SOON_DAYS) return { status: 'expiring', days }
  return { status: 'valid', days }
}
