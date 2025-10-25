import type { Database } from '@/lib/types/database.types'
import type { BackgroundStatus, ComplianceOutcome } from './metrics'
import { deriveRiskLabel } from './metrics'

export type AdminStaffRow = Database['public']['Views']['admin_staff_overview_view']['Row'] & {
  active_services_count?: number | null
  schedule_count?: number | null
  completed_appointments?: number | null
}

export type AppointmentRow = Database['public']['Views']['admin_appointments_overview_view']['Row']
export type ReviewRow = Database['engagement']['Tables']['salon_reviews']['Row']

export type BackgroundRow = {
  user_id: string
  background_check_status: string | null
  background_check_date: string | null
}

export type MetadataRow = {
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
