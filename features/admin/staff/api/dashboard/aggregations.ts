import 'server-only'

import {
  calculateComplianceScore,
  deriveRiskLabel,
  normalizeBackgroundStatus,
} from './metrics'
import type { BackgroundStatus } from './metrics'

import type {
  AppointmentRow,
  MetadataRow,
  ReviewRow,
  StaffDashboardStats,
  StaffPerformanceBenchmark,
  StaffWithMetrics,
} from './types'

export function groupAppointmentsByStaff(rows: AppointmentRow[]) {
  const map = new Map<string, AppointmentRow[]>()
  for (const row of rows) {
    if (!row['staff_id']) continue
    if (!map.has(row['staff_id'])) {
      map.set(row['staff_id'], [])
    }
    map.get(row['staff_id'])!.push(row)
  }
  return map
}

export function groupReviewsByAppointment(rows: ReviewRow[]) {
  // NOTE: salon_reviews_view does not have appointment_id column
  // Return all reviews as a single group since they cannot be filtered by appointment
  const map = new Map<string, ReviewRow[]>()
  map.set('all_reviews', rows)
  return map
}

export function extractCertifications(metadata?: MetadataRow) {
  if (!metadata?.tags?.length) return [] as string[]
  return metadata.tags.filter((tag) => {
    const normalized = tag.toLowerCase()
    return (
      normalized.startsWith('cert:') ||
      normalized.includes('license') ||
      normalized.includes('certified')
    )
  })
}

export function calculateStaffMetrics(
  appointments: AppointmentRow[],
  reviewsByAppointment: Map<string, ReviewRow[]>,
) {
  const totalAppointments = appointments.length
  let completed = 0
  let cancelled = 0
  let noShow = 0
  let lastAppointmentAt: string | null = null

  const reviewAccumulator: { ratings: number[]; flagged: number } = {
    ratings: [],
    flagged: 0,
  }

  for (const appointment of appointments) {
    if (!appointment['status']) continue
    const status = appointment['status'].toLowerCase()
    if (status === 'completed') completed += 1
    else if (status === 'cancelled') cancelled += 1
    else if (status === 'no_show') noShow += 1

    if (appointment['start_time']) {
      if (!lastAppointmentAt || appointment['start_time'] > lastAppointmentAt) {
        lastAppointmentAt = appointment['start_time']
      }
    }
  }

  // NOTE: salon_reviews_view does not have appointment_id, so we process all reviews
  const allReviews = reviewsByAppointment.get('all_reviews') ?? []
  for (const review of allReviews) {
    if (typeof review.rating === 'number') {
      reviewAccumulator.ratings.push(review.rating)
    }
    if (review.is_flagged) {
      reviewAccumulator.flagged += 1
    }
  }

  const averageRating = reviewAccumulator.ratings.length
    ? reviewAccumulator.ratings.reduce((sum, rating) => sum + rating, 0) /
      reviewAccumulator.ratings.length
    : null

  return {
    totalAppointments,
    completedAppointments: completed,
    cancelledAppointments: cancelled,
    noShowAppointments: noShow,
    averageRating,
    flaggedReviews: reviewAccumulator.flagged,
    lastAppointmentAt,
  }
}

export function buildStaffMetrics(
  staffAppointments: AppointmentRow[],
  reviewsByAppointment: Map<string, ReviewRow[]>,
  backgroundStatus: BackgroundStatus,
  certifications: string[],
) {
  const metrics = calculateStaffMetrics(staffAppointments, reviewsByAppointment)

  const complianceResult = calculateComplianceScore({
    totalAppointments: metrics.totalAppointments,
    completedAppointments: metrics.completedAppointments,
    cancelledAppointments: metrics.cancelledAppointments,
    noShowAppointments: metrics.noShowAppointments,
    flaggedReviews: metrics.flaggedReviews,
    averageRating: metrics.averageRating,
    backgroundCheckStatus: backgroundStatus,
    certificationsCount: certifications.length,
  })

  return {
    metrics,
    compliance: {
      score: complianceResult.score,
      status: complianceResult.status,
      completionRate: complianceResult.completionRate,
      noShowRate: complianceResult.noShowRate,
      cancellationRate: complianceResult.cancellationRate,
      flaggedRate: complianceResult.flaggedRate,
      riskLabel: deriveRiskLabel(complianceResult.status),
      issues: complianceResult.issues,
    },
  }
}

export function calculateDashboardStats(staff: StaffWithMetrics[]): StaffDashboardStats {
  if (staff.length === 0) {
    return {
      totalStaff: 0,
      verifiedStaff: 0,
      pendingReviews: 0,
      criticalAlerts: 0,
      averageExperience: 0,
      averageCompliance: 0,
    }
  }

  let totalExperience = 0
  let totalCompliance = 0
  let verified = 0
  let pending = 0
  let critical = 0

  staff.forEach((person) => {
    totalExperience += person.experienceYears
    totalCompliance += person.compliance.score

    if (person.background['status'] === 'clear') verified += 1
    if (person.background['status'] === 'pending' || person.background['status'] === 'missing') pending += 1
    if (person.compliance['status'] === 'critical') critical += 1
  })

  return {
    totalStaff: staff.length,
    verifiedStaff: verified,
    pendingReviews: pending,
    criticalAlerts: critical,
    averageExperience: Number((totalExperience / staff.length).toFixed(1)),
    averageCompliance: Math.round(totalCompliance / staff.length),
  }
}

export function buildTopPerformers(staff: StaffWithMetrics[]): StaffPerformanceBenchmark[] {
  return staff
    .filter((person) => person.metrics.completedAppointments >= 5)
    .map<StaffPerformanceBenchmark>((person) => ({
      id: person['id'],
      name: person.fullName || person['title'] || 'Staff member',
      salonName: person.salonName,
      averageRating: person.metrics.averageRating,
      completionRate: person.compliance.completionRate,
      complianceScore: person.compliance.score,
    }))
    .sort((a, b) => {
      if ((b.averageRating ?? 0) !== (a.averageRating ?? 0)) {
        return (b.averageRating ?? 0) - (a.averageRating ?? 0)
      }
      return b.complianceScore - a.complianceScore
    })
    .slice(0, 8)
}
