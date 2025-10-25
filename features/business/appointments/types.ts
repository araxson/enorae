import type { Database } from '@/lib/types/database.types'

/**
 * Appointment scheduling and details types
 * Used by appointment management features
 */

// Database views
// Note: Using scheduling schema tables directly as views don't have enriched properties
export type Appointment = Database['scheduling']['Tables']['appointments']['Row']
export type AppointmentWithDetails = Appointment

export type BlockedTime = Database['public']['Views']['blocked_times_view']['Row']
export type StaffSchedule = Database['public']['Views']['staff_schedules_view']['Row']
export type StaffService = Database['public']['Views']['staff_services_view']['Row']
export type OperatingHour = Database['public']['Views']['operating_hours_view']['Row']

// Database write types
export type AppointmentInsert = Database['scheduling']['Tables']['appointments']['Insert']
export type AppointmentUpdate = Database['scheduling']['Tables']['appointments']['Update']
export type AppointmentServiceInsert = Database['scheduling']['Tables']['appointment_services']['Insert']
