import { differenceInCalendarDays } from 'date-fns'
import type {
  AdminSalonRow,
  SalonBaseRow,
  ComplianceInput,
  ComplianceResult,
  HealthInput,
  LicenseStatus,
  ComplianceLevel,
  EnhancedSalon,
  SalonFilters,
} from './types'

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

  if ((input.maxStaff ?? 0) > 0 && (input.employeeCount ?? 0) > (input.maxStaff ?? 0)) {
    issues.push('Staff count exceeds limit')
    score -= 15
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
  employeeCount,
  maxStaff,
}: HealthInput): number {
  const ratingScore = clamp((ratingAverage ?? 0) / 5, 0, 1)
  const bookingScore = clamp((totalBookings ?? 0) / 200, 0, 1)
  const revenueScore = clamp((totalRevenue ?? 0) / 150000, 0, 1)
  const staffCapacity = clamp(
    (employeeCount ?? 0) / Math.max(maxStaff ?? employeeCount ?? 1, 1),
    0,
    1,
  )

  const weighted =
    ratingScore * 0.35 + bookingScore * 0.25 + revenueScore * 0.3 + staffCapacity * 0.1
  return Math.round(weighted * 100)
}

export function deriveLicenseStatus(expiresAt: string | null): { status: LicenseStatus; days: number | null } {
  if (!expiresAt) return { status: 'unknown', days: null }
  const days = differenceInCalendarDays(new Date(expiresAt), new Date())
  if (days < 0) return { status: 'expired', days }
  if (days <= 30) return { status: 'expiring', days }
  return { status: 'valid', days }
}

export function deriveVerificationStatus(row: AdminSalonRow, base: SalonBaseRow | undefined): boolean {
  if (base?.is_verified !== undefined && base?.is_verified !== null) {
    return Boolean(base.is_verified)
  }

  return Boolean(row.is_accepting_bookings && (row.total_revenue || row.total_bookings || 0) > 0)
}

export function applySalonFilters(salons: EnhancedSalon[], filters: SalonFilters) {
  return salons.filter((salon) => {
    const matchesChain = !filters.chain_id || salon.chain_id === filters.chain_id
    const matchesTier = !filters.subscription_tier || salon.subscription_tier === filters.subscription_tier
    const matchesSearch = !filters.search
      ? true
      : [salon.name ?? '', salon.id ?? '']
          .filter((value) => value.length > 0)
          .some((value) => value.toLowerCase().includes(filters.search!.toLowerCase()))

    return matchesChain && matchesTier && matchesSearch
  })
}

export function countBy<T>(items: T[], selector: (item: T) => string) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = selector(item)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}
