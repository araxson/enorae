import type { Database } from '@/lib/types/database.types'

export type AppointmentOverviewRow = Database['public']['Views']['admin_appointments_overview']['Row']
export type AppointmentRow = Database['public']['Views']['appointments']['Row']

export interface AppointmentStatusTotals {
  total: number
  completed: number
  cancelled: number
  noShow: number
  inProgress: number
  upcoming: number
}

export interface AppointmentPerformanceMetrics {
  completionRate: number
  cancellationRate: number
  noShowRate: number
  averageDuration: number
  totalRevenue: number
  averageTicket: number
}

export interface AppointmentTrendPoint {
  date: string
  total: number
  completed: number
  cancelled: number
  noShow: number
}

export interface CancellationPattern {
  label: string
  count: number
  share: number
  description: string
}

export interface NoShowRecord {
  id: string
  salonName: string | null
  customerName: string | null
  staffName: string | null
  startTime: string | null
  totalPrice: number | null
}

export interface FraudAlert {
  id: string
  type: 'repeated_no_show' | 'high_value_cancellation' | 'rapid_cancellation' | 'double_booking_risk'
  score: number
  summary: string
  relatedAppointmentIds: string[]
  customerId?: string | null
  salonId?: string | null
}

export interface DisputeCandidate {
  appointmentId: string
  customerName: string | null
  salonName: string | null
  status: 'pending' | 'escalate' | 'review'
  amount: number | null
  reason: string
  recommendedAction: string
}

export interface SalonPerformance {
  salonId: string
  salonName: string | null
  total: number
  completed: number
  cancelled: number
  noShow: number
  totalRevenue: number
  avgDuration: number
}

export interface AppointmentSnapshot {
  timeframe: {
    start: string
    end: string
  }
  totals: AppointmentStatusTotals
  performance: AppointmentPerformanceMetrics
  trend: AppointmentTrendPoint[]
  cancellations: CancellationPattern[]
  noShows: {
    count: number
    rate: number
    recent: NoShowRecord[]
  }
  fraudAlerts: FraudAlert[]
  disputes: DisputeCandidate[]
  salonPerformance: SalonPerformance[]
  recentAppointments: AppointmentOverviewRow[]
}
