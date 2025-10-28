// Core type definitions for staff dashboard
// This file breaks the circular dependency between types.ts and dashboard-types.ts

export interface AdminStaffRow {
  id: string
  full_name: string | null
  title: string | null
  salon_id: string | null
  salon_name: string | null
  user_id: string | null
  experience_years: number | null
}

export interface AppointmentRow {
  id: string
  staff_id: string | null
  status: string | null
  start_time: string | null
  duration_minutes: number | null
  salon_id: string | null
}

export interface BackgroundRow {
  user_id: string
  background_check_status: string | null
  background_check_date: string | null
}

export interface MetadataRow {
  profile_id: string
  tags: string[] | null
}

export interface ReviewRow {
  id: string
  rating: number | null
  is_flagged: boolean | null
  customer_id: string | null
  created_at: string | null
}

export interface StaffWithMetrics {
  id: string
  userId: string | null
  fullName: string | null
  title: string | null
  salonId: string | null
  salonName: string | null
  salonSlug: string | null
  staffRole: string | null
  experienceYears: number
  background: {
    status: string
    lastCheckedAt: string | null
  }
  metrics: {
    totalAppointments: number
    completedAppointments: number
    cancelledAppointments: number
    noShowAppointments: number
    averageRating: number | null
    flaggedReviews: number
    lastAppointmentAt: string | null
  }
  compliance: {
    score: number
    status: string
    completionRate: number
    noShowRate: number
    cancellationRate: number
    flaggedRate: number
    riskLabel: string
    issues: string[]
  }
  certifications: string[]
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
