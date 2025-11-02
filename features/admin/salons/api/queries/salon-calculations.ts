import 'server-only'

import { differenceInCalendarDays } from 'date-fns'
import { createOperationLogger } from '@/lib/observability/logger'

export type LicenseStatus = 'valid' | 'expiring' | 'expired' | 'unknown'
export type ComplianceLevel = 'low' | 'medium' | 'high'

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
  let score = 80

  if (!input.isVerified) {
    issues.push('Verification pending')
    score -= 20
  }

  switch (input.licenseStatus) {
    case 'expired':
      issues.push('License expired')
      score -= 25
      break
    case 'expiring':
      issues.push('License expiring soon')
      score -= 10
      break
    case 'unknown':
      issues.push('License status unknown')
      score -= 5
      break
  }

  if ((input.ratingAverage ?? 0) < 3) {
    issues.push('Low customer rating')
    score -= 10
  } else if ((input.ratingAverage ?? 0) > 4.5) {
    score += 5
  }

  if ((input.totalBookings ?? 0) < 5) {
    issues.push('Low booking volume')
    score -= 5
  }

  const finalScore = clamp(Math.round(score), 0, 100)
  let level: ComplianceLevel = 'low'

  if (finalScore < 60) level = 'high'
  else if (finalScore < 80) level = 'medium'

  return { score: finalScore, level, issues }
}

export function calculateHealthScore({
  ratingAverage,
  totalBookings,
  totalRevenue,
  staffCount,
}: HealthInput): number {
  const ratingScore = clamp((ratingAverage ?? 0) / 5, 0, 1)
  const bookingScore = clamp((totalBookings ?? 0) / 200, 0, 1)
  // Revenue score: normalized by max threshold of $150k
  const MAX_REVENUE_THRESHOLD = 150000
  const revenueScore = clamp((totalRevenue ?? 0) / MAX_REVENUE_THRESHOLD, 0, 1)
  const staffScore = clamp((staffCount ?? 0) / 50, 0, 1)

  const weighted =
    ratingScore * 0.35 + bookingScore * 0.25 + revenueScore * 0.3 + staffScore * 0.1
  return Math.round(weighted * 100)
}

export function deriveLicenseStatus(expiresAt: string | null): { status: LicenseStatus; days: number | null } {
  if (!expiresAt) return { status: 'unknown', days: null }
  const days = differenceInCalendarDays(new Date(expiresAt), new Date())
  if (days < 0) return { status: 'expired', days }
  if (days <= 30) return { status: 'expiring', days }
  return { status: 'valid', days }
}
