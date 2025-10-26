export interface AdminAppointmentRecord {}

export interface AdminAppointmentFilter {}

// Re-export types from api/types.ts
export type {
  AppointmentOverviewRow,
  AppointmentRow,
  AppointmentStatusTotals,
  AppointmentPerformanceMetrics,
  AppointmentTrendPoint,
  CancellationPattern,
  NoShowRecord,
  FraudAlert,
  DisputeCandidate,
  SalonPerformance,
  AppointmentSnapshot,
} from './api/types'
