import type { Database } from '@/lib/types/database.types'

/**
 * Appointment scheduling and details types
 * Used by appointment management features
 */

// Re-export shared types from features/shared/appointments
export type {
  Appointment,
  AppointmentWithDetails,
  BlockedTime,
  StaffSchedule,
  StaffService,
  OperatingHour,
} from '@/features/shared/appointments/api/types'

// Re-export query types
export type { AppointmentServiceDetails } from './queries/appointment-services'
export type { ServiceOption, StaffOption } from './queries/service-options'

// Database write types
export type AppointmentInsert = Database['scheduling']['Tables']['appointments']['Insert']
export type AppointmentUpdate = Database['scheduling']['Tables']['appointments']['Update']
export type AppointmentServiceInsert = Database['scheduling']['Tables']['appointment_services']['Insert']

// Form data types
export type ServiceFormData = {
  serviceId?: string
  staffId: string
  startTime: string
  endTime: string
  durationMinutes: string
  status?: string
}
