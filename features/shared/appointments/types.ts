import type { Database } from '@/lib/types/database.types'

export interface AppointmentsState {}

export interface AppointmentsParams {}

// Shared appointment types used across portals
export type Appointment = Database['scheduling']['Tables']['appointments']['Row']
export type AppointmentWithDetails = Appointment
export type BlockedTime = Database['public']['Views']['blocked_times_view']['Row']
export type StaffSchedule = Database['public']['Views']['staff_schedules_view']['Row']
export type StaffService = Database['public']['Views']['staff_services_view']['Row']
export type OperatingHour = Database['public']['Views']['operating_hours_view']['Row']
