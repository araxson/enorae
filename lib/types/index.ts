/**
 * Central Types Export
 *
 * Exports only TRULY SHARED types used across 3+ features.
 * Feature-specific types should be in features/{portal}/{feature}/types.ts
 *
 * COLOCATE TYPES WITH FEATURES - only core/generic types here
 *
 * @example
 * import type { Database, Env } from '@/lib/types'
 * import type { Appointment } from '@/features/business/appointments'
 */

import type { Database } from './database.types'

// ============================================================================
// DATABASE TYPES (Generated from Supabase)
// ============================================================================

export type { Database } from './database.types'

// ============================================================================
// CORE VIEW TYPES (Used by multiple portals/features)
// ============================================================================

export type Salon = Database['public']['Views']['salons']['Row']
export type Service = Database['public']['Views']['services']['Row']
export type Staff = Database['public']['Views']['staff']['Row']
export type Appointment = Database['public']['Views']['appointments']['Row']
export type Profile = Database['public']['Views']['profiles']['Row']
export type UserRole = Database['public']['Views']['user_roles']['Row']

// ============================================================================
// ENVIRONMENT & VALIDATION TYPES
// ============================================================================

export type { Env } from '../env'
export type { LoginInput, SignupInput } from '../validations/auth'
export type { BookingInput } from '../validations/booking'

// ============================================================================
// GENERIC UI & COMPONENT TYPES (Used everywhere)
// ============================================================================

export type { WithClassName, WithChildren, WithOptionalChildren } from './app/components'
export type { PageProps, LayoutProps } from './app/page'
export type { ApiResponse, ApiError, PaginatedResponse } from './app/api'
export type { FormState } from './app/forms'
export type {
  ButtonClickHandler,
  DivClickHandler,
  FormSubmitHandler,
  InputChangeHandler,
  TextAreaChangeHandler,
  SelectChangeHandler,
  KeyboardHandler,
  FocusHandler,
} from './app/events'

// ============================================================================
// UTILITY TYPES (Generic helpers used across codebase)
// ============================================================================

export type { Nullable, Optional, MaybeNull, PickExact, PartialBy, RequiredBy } from './app/utility'

// ============================================================================
// CONSTANTS AS TYPES (Shared domain enums)
// ============================================================================

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

// ============================================================================
// FEATURE-SPECIFIC TYPES
// ============================================================================
//
// DO NOT ADD FEATURE TYPES HERE!
// Import feature-specific types directly from their features:
//
// ❌ DON'T:  import { AppointmentWithDetails } from '@/lib/types'
// ✅ DO:     import { AppointmentWithDetails } from '@/features/business/appointments'
//
// ============================================================================
