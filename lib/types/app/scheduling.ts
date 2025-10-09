import type { Database } from '../database.types'

export type Appointment = Database['public']['Views']['appointments']['Row']
export type AppointmentWithDetails = Appointment
export type BlockedTime = Database['public']['Views']['blocked_times']['Row']
export type StaffSchedule = Database['public']['Views']['staff_schedules']['Row']
export type StaffService = Database['public']['Views']['staff_services']['Row']
export type OperatingHour = Database['public']['Views']['operating_hours']['Row']
