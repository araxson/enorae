import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import {
  calculateComplianceScore,
  deriveRiskLabel,
  normalizeBackgroundStatus,
  type BackgroundStatus,
  type ComplianceOutcome,
} from '../utils/metrics'

const APPOINTMENT_LOOKBACK_DAYS = 90
const MAX_APPOINTMENT_SAMPLE = 2000
const MAX_REVIEW_SAMPLE = 1500

// Extend generated types with optional metrics that may not be captured in the generated typings yet
 type AdminStaffRow = Database['public']['Views']['admin_staff_overview']['Row'] & {
  active_services_count?: number | null
  schedule_count?: number | null
  completed_appointments?: number | null
 }

type AppointmentRow = Database['public']['Views']['admin_appointments_overview']['Row']
type ReviewRow = Database['public']['Tables']['salon_reviews']['Row']

type BackgroundRow = {
  user_id: string
  background_check_status: string | null
  background_check_date: string | null
}

type MetadataRow = {
  profile_id: string
  tags: string[] | null
}

export interface StaffWithMetrics {
  id: string
  userId: string | null
  fullName: string | null
  salonId: string | null
  salonName: string | null
  salonSlug: string | null
  staffRole: string | null
  title: string | null
  experienceYears: number
  background: {
    status: BackgroundStatus
    lastCheckedAt: string | null
  }
  certifications: string[]
  metrics: {
    totalAppointments: number
    completedAppointments: number
    cancelledAppointments: number
    noShowAppointments: number
    averageRating: number | null
    flaggedReviews: number
    lastAppointmentAt: string | null
  }
  compliance: ComplianceOutcome & {
    riskLabel: ReturnType<typeof deriveRiskLabel>
  }
}

export interface StaffDashboardStats {
  totalStaff: number
  verifiedStaff: number
  pendingReviews: number
  criticalAlerts: number
  averageExperience: number
  averageCompliance: number
}

export interface StaffPerformanceBenchmark {
  id: string
  name: string
  salonName: string | null
  averageRating: number | null
  completionRate: number
  complianceScore: number
}

export interface StaffDashboardData {
  staff: StaffWithMetrics[]
  stats: StaffDashboardStats
  highRiskStaff: StaffWithMetrics[]
  verificationQueue: StaffWithMetrics[]
  topPerformers: StaffPerformanceBenchmark[]
}

export async function getStaffDashboardData(): Promise<StaffDashboardData> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data: staffData, error: staffError } = await supabase
    .from('admin_staff_overview')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)

  if (staffError) {
    throw staffError
  }

  const staffRows = (staffData || []).filter((row): row is AdminStaffRow & { id: string } => Boolean(row?.id))
  const userIds = Array.from(new Set(staffRows.map((row) => row.user_id).filter(Boolean))) as string[]
  const staffIds = Array.from(new Set(staffRows.map((row) => row.id)))

  const [backgroundChecks, metadataRows, appointmentRows] = await Promise.all([
    fetchBackgroundChecks(supabase, userIds),
    fetchProfileMetadata(supabase, userIds),
    fetchRecentAppointments(supabase, staffIds),
  ])

  const appointmentByStaff = groupAppointmentsByStaff(appointmentRows)
  const appointmentIds = appointmentRows
    .map((appointment) => appointment.id)
    .filter(Boolean)
    .slice(0, MAX_REVIEW_SAMPLE)

  const reviewRows = await fetchReviewSample(supabase, appointmentIds)
  const reviewsByAppointment = groupReviewsByAppointment(reviewRows)

  const staffWithMetrics: StaffWithMetrics[] = staffRows.map((row) => {
    const background = backgroundChecks.get(row.user_id ?? '')
    const backgroundStatus = normalizeBackgroundStatus(background?.background_check_status)
    const certifications = extractCertifications(metadataRows.get(row.user_id ?? ''))
    const staffAppointments = appointmentByStaff.get(row.id) ?? []

    const metrics = calculateStaffMetrics(staffAppointments, reviewsByAppointment)

    const compliance = calculateComplianceScore({
      totalAppointments: metrics.totalAppointments,
      completedAppointments: metrics.completedAppointments,
      cancelledAppointments: metrics.cancelledAppointments,
      noShowAppointments: metrics.noShowAppointments,
      flaggedReviews: metrics.flaggedReviews,
      averageRating: metrics.averageRating,
      backgroundCheckStatus: backgroundStatus,
      certificationsCount: certifications.length,
    })

    const riskLabel = deriveRiskLabel(compliance.status)

    return {
      id: row.id,
      userId: row.user_id,
      fullName: row.full_name,
      salonId: row.salon_id,
      salonName: row.salon_name,
      salonSlug: row.salon_slug,
      staffRole: row.staff_role,
      title: row.title,
      experienceYears: Number(row.experience_years ?? 0),
      background: {
        status: backgroundStatus,
        lastCheckedAt: background?.background_check_date ?? null,
      },
      certifications,
      metrics,
      compliance: { ...compliance, riskLabel },
    }
  })

  const stats = calculateDashboardStats(staffWithMetrics)

  const highRiskStaff = staffWithMetrics
    .filter((staff) => staff.compliance.status === 'critical')
    .sort((a, b) => a.compliance.score - b.compliance.score)
    .slice(0, 10)

  const verificationQueue = staffWithMetrics
    .filter((staff) => staff.background.status === 'pending' || staff.background.status === 'missing')
    .sort((a, b) => (a.background.status === 'missing' ? -1 : 1))
    .slice(0, 10)

  const topPerformers = staffWithMetrics
    .filter((staff) => staff.metrics.completedAppointments >= 5)
    .map<StaffPerformanceBenchmark>((staff) => ({
      id: staff.id,
      name: staff.fullName || staff.title || 'Staff member',
      salonName: staff.salonName,
      averageRating: staff.metrics.averageRating,
      completionRate: staff.compliance.completionRate,
      complianceScore: staff.compliance.score,
    }))
    .sort((a, b) => {
      if ((b.averageRating ?? 0) !== (a.averageRating ?? 0)) {
        return (b.averageRating ?? 0) - (a.averageRating ?? 0)
      }
      return b.complianceScore - a.complianceScore
    })
    .slice(0, 8)

  return {
    staff: staffWithMetrics,
    stats,
    highRiskStaff,
    verificationQueue,
    topPerformers,
  }
}

async function fetchBackgroundChecks(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userIds: string[],
) {
  if (!userIds.length) return new Map<string, BackgroundRow>()

  const { data, error } = await supabase
    .schema('identity')
    .from('user_sensitive_data')
    .select('user_id, background_check_status, background_check_date')
    .in('user_id', userIds)

  if (error) throw error

  return new Map<string, BackgroundRow>(
    (data || []).map((row) => [row.user_id, row as BackgroundRow])
  )
}

async function fetchProfileMetadata(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userIds: string[],
) {
  if (!userIds.length) return new Map<string, MetadataRow>()

  const { data, error } = await supabase
    .from('profiles_metadata')
    .select('profile_id, tags')
    .in('profile_id', userIds)

  if (error) throw error

  return new Map<string, MetadataRow>(
    (data || []).map((row) => [row.profile_id, row as MetadataRow])
  )
}

async function fetchRecentAppointments(
  supabase: ReturnType<typeof createServiceRoleClient>,
  staffIds: string[],
) {
  if (!staffIds.length) return [] as AppointmentRow[]

  const since = new Date()
  since.setDate(since.getDate() - APPOINTMENT_LOOKBACK_DAYS)

  const { data, error } = await supabase
    .from('admin_appointments_overview')
    .select('id, staff_id, status, start_time, duration_minutes, salon_id')
    .in('staff_id', staffIds)
    .gte('start_time', since.toISOString())
    .limit(MAX_APPOINTMENT_SAMPLE)

  if (error) throw error
  return (data || []) as AppointmentRow[]
}

async function fetchReviewSample(
  supabase: ReturnType<typeof createServiceRoleClient>,
  appointmentIds: (string | null)[],
) {
  if (!appointmentIds.length) return [] as ReviewRow[]

  const validIds = appointmentIds.filter(Boolean) as string[]
  if (!validIds.length) return [] as ReviewRow[]

  const { data, error } = await supabase
    .from('salon_reviews')
    .select('appointment_id, rating, is_flagged, customer_id, created_at')
    .in('appointment_id', validIds)
    .limit(MAX_REVIEW_SAMPLE)

  if (error) throw error
  return (data || []) as ReviewRow[]
}

function groupAppointmentsByStaff(rows: AppointmentRow[]) {
  const map = new Map<string, AppointmentRow[]>()
  for (const row of rows) {
    if (!row.staff_id) continue
    if (!map.has(row.staff_id)) {
      map.set(row.staff_id, [])
    }
    map.get(row.staff_id)!.push(row)
  }
  return map
}

function groupReviewsByAppointment(rows: ReviewRow[]) {
  const map = new Map<string, ReviewRow[]>()
  for (const row of rows) {
    if (!row.appointment_id) continue
    if (!map.has(row.appointment_id)) {
      map.set(row.appointment_id, [])
    }
    map.get(row.appointment_id)!.push(row)
  }
  return map
}

function extractCertifications(metadata?: MetadataRow) {
  if (!metadata?.tags?.length) return []
  return metadata.tags.filter((tag) => {
    const normalized = tag.toLowerCase()
    return (
      normalized.startsWith('cert:') ||
      normalized.includes('license') ||
      normalized.includes('certified')
    )
  })
}

function calculateStaffMetrics(
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
    if (!appointment.status) continue
    const status = appointment.status.toLowerCase()
    if (status === 'completed') completed += 1
    else if (status === 'cancelled') cancelled += 1
    else if (status === 'no_show') noShow += 1

    if (appointment.start_time) {
      if (!lastAppointmentAt || appointment.start_time > lastAppointmentAt) {
        lastAppointmentAt = appointment.start_time
      }
    }

    if (appointment.id) {
      const reviews = reviewsByAppointment.get(appointment.id) ?? []
      for (const review of reviews) {
        if (typeof review.rating === 'number') {
          reviewAccumulator.ratings.push(review.rating)
        }
        if (review.is_flagged) {
          reviewAccumulator.flagged += 1
        }
      }
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

function calculateDashboardStats(staff: StaffWithMetrics[]): StaffDashboardStats {
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

    if (person.background.status === 'clear') verified += 1
    if (person.background.status === 'pending' || person.background.status === 'missing') pending += 1
    if (person.compliance.status === 'critical') critical += 1
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
