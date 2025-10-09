import type { Database } from '../database.types'

export type Salon = Database['public']['Views']['salons']['Row']
export type Appointment = Database['public']['Views']['appointments']['Row']
export type AppointmentService = Database['public']['Views']['appointment_services']['Row']
export type Service = Database['public']['Views']['services']['Row']
export type Staff = Database['public']['Views']['staff']['Row']
export type StaffProfile = Database['public']['Views']['staff_profiles']['Row']
export type Profile = Database['public']['Views']['profiles']['Row']
export type UserRole = Database['public']['Views']['user_roles']['Row']
