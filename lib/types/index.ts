/**
 * Central Types Export
 *
 * Re-export all types from a single location for easier imports.
 * Import from this file instead of individual type files.
 *
 * @example
 * import type { Database, Env, AppointmentStatus } from '@/lib/types'
 */

// Database Types
export type { Database } from './database.types'

// Environment Types
export type { Env } from '../env'

// Validation Types
export type { LoginInput, SignupInput } from '../validations/auth'
export type { BookingInput } from '../validations/booking'

// Database View Types (commonly used)
export type Salon = Database['public']['Views']['salons']['Row']
export type Service = Database['public']['Views']['services']['Row']
export type Staff = Database['public']['Views']['staff']['Row']
export type Appointment = Database['public']['Views']['appointments']['Row']
export type Profile = Database['public']['Views']['profiles']['Row']
export type UserRole = Database['public']['Views']['user_roles']['Row']

// Constants as Types
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
export type StaffStatus = 'active' | 'inactive' | 'on_leave'
export type UserRoleType =
  | 'super_admin'
  | 'platform_admin'
  | 'tenant_owner'
  | 'salon_owner'
  | 'salon_manager'
  | 'senior_staff'
  | 'staff'
  | 'junior_staff'
  | 'vip_customer'
  | 'customer'
  | 'guest'

// Re-export from database types for convenience
import type { Database } from './database.types'
