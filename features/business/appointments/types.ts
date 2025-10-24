import type { Database } from '@/lib/types/database.types'

/**
 * Appointment scheduling and details types
 * Used by appointment management features
 */

// Database views
export type Appointment = Database['public']['Views']['appointments']['Row']
export type AppointmentWithDetails = Appointment

export type BlockedTime = Database['public']['Views']['blocked_times']['Row']
export type StaffSchedule = Database['public']['Views']['staff_schedules']['Row']
export type StaffService = Database['public']['Views']['staff_services']['Row']
export type OperatingHour = Database['public']['Views']['operating_hours']['Row']

// Database write types
export type AppointmentInsert = Database['scheduling']['Tables']['appointments']['Insert']
export type AppointmentUpdate = Database['scheduling']['Tables']['appointments']['Update']
export type AppointmentServiceInsert = Database['scheduling']['Tables']['appointment_services']['Insert']
