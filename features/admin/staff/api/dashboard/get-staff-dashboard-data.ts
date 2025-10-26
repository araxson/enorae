import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { normalizeBackgroundStatus } from './metrics'

import {
  fetchBackgroundChecks,
  fetchProfileMetadata,
  fetchRecentAppointments,
  fetchReviewSample,
} from './fetchers'
import { MAX_REVIEW_SAMPLE } from './constants'
import {
  buildStaffMetrics,
  calculateDashboardStats,
  extractCertifications,
  groupAppointmentsByStaff,
  groupReviewsByAppointment,
  buildTopPerformers,
} from './aggregations'
import type { AdminStaffRow, StaffDashboardData, StaffWithMetrics } from './types'

export async function getStaffDashboardData(): Promise<StaffDashboardData> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data: staffData, error: staffError } = await supabase
    .from('admin_staff_overview_view')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)

  if (staffError) throw staffError

  const staffRows = (staffData || []).filter((row) => Boolean(row?.id))
  const userIds = Array.from(
    new Set(staffRows.map((row) => row.user_id).filter((id): id is string => Boolean(id)))
  )
  const staffIds = Array.from(
    new Set(staffRows.map((row) => row.id).filter((id): id is string => Boolean(id)))
  )

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

  const staffWithMetrics: StaffWithMetrics[] = staffRows
    .filter((row): row is typeof staffRows[number] & { id: string; salon_id: string } => Boolean(row.id && row.salon_id))
    .map((row) => {
      const userId = row.user_id ?? ''
      const background = backgroundChecks.get(userId)
      const backgroundStatus = normalizeBackgroundStatus(background?.background_check_status)
      const certifications = extractCertifications(metadataRows.get(userId))
      const staffAppointments = appointmentByStaff.get(row.id) ?? []

    const { metrics, compliance } = buildStaffMetrics(
      staffAppointments,
      reviewsByAppointment,
      backgroundStatus,
      certifications,
    )

      return {
        id: row.id!,
        userId: row.user_id,
        fullName: row.full_name,
        salonId: row.salon_id!,
        salonName: row.salon_name,
        salonSlug: row.salon_slug ?? '',
        staffRole: row.staff_role,
        title: row.title,
        experienceYears: Number(row.experience_years ?? 0),
      background: {
        status: backgroundStatus,
        lastCheckedAt: background?.background_check_date ?? null,
      },
      certifications,
      metrics,
      compliance,
    }
  })

  const stats = calculateDashboardStats(staffWithMetrics)

  const highRiskStaff = staffWithMetrics
    .filter((person) => person.compliance['status'] === 'critical')
    .sort((a, b) => a.compliance.score - b.compliance.score)
    .slice(0, 10)

  const verificationQueue = staffWithMetrics
    .filter(
      (person) => person.background['status'] === 'pending' || person.background['status'] === 'missing',
    )
    .sort((a, b) => (a.background['status'] === 'missing' ? -1 : 1))
    .slice(0, 10)

  const topPerformers = buildTopPerformers(staffWithMetrics)

  return {
    staff: staffWithMetrics,
    stats,
    highRiskStaff,
    verificationQueue,
    topPerformers,
  }
}
