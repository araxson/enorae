/**
 * Centralized Application Types
 *
 * CRITICAL RULES:
 * 1. ALL types use Database['public']['Views'] (NEVER Tables)
 * 2. For tables without public views, use schema Tables ONLY for mutations
 * 3. Import these centralized types everywhere instead of inline type definitions
 *
 * @see CLAUDE.md
 * @see docs/03-database/best-practices.md
 */

import type { Database } from './database.types'

// ============================================================================
// PUBLIC VIEW TYPES (For SELECT queries)
// ============================================================================

// Core Entities
export type Salon = Database['public']['Views']['salons']['Row']
export type Appointment = Database['public']['Views']['appointments']['Row']
export type AppointmentService = Database['public']['Views']['appointment_services']['Row']
export type Service = Database['public']['Views']['services']['Row']
export type Staff = Database['public']['Views']['staff']['Row']
export type StaffProfile = Database['public']['Views']['staff_profiles']['Row']
export type Profile = Database['public']['Views']['profiles']['Row']
export type UserRole = Database['public']['Views']['user_roles']['Row']

// Scheduling
export type BlockedTime = Database['public']['Views']['blocked_times']['Row']
export type StaffSchedule = Database['public']['Views']['staff_schedules']['Row']
export type StaffService = Database['public']['Views']['staff_services']['Row']
export type OperatingHour = Database['public']['Views']['operating_hours']['Row']

// Communication
export type MessageThread = Database['public']['Views']['message_threads']['Row']
export type Message = Database['public']['Views']['messages']['Row']

// Engagement
export type CustomerFavorite = Database['public']['Views']['customer_favorites']['Row']

// Analytics (Views available)
export type DailyMetric = Database['public']['Views']['daily_metrics']['Row']
export type OperationalMetric = Database['public']['Views']['operational_metrics']['Row']

// Inventory (Views available)
export type Product = Database['public']['Views']['products']['Row']
export type ProductCategory = Database['public']['Views']['product_categories']['Row']
export type ProductUsage = Database['public']['Views']['product_usage']['Row']
export type PurchaseOrder = Database['public']['Views']['purchase_orders']['Row']
export type PurchaseOrderItem = Database['public']['Views']['purchase_order_items']['Row']
export type StockAlert = Database['public']['Views']['stock_alerts']['Row']
export type StockLevel = Database['public']['Views']['stock_levels']['Row']
export type StockLocation = Database['public']['Views']['stock_locations']['Row']
export type StockMovement = Database['public']['Views']['stock_movements']['Row']
export type Supplier = Database['public']['Views']['suppliers']['Row']

// Organization (Views available)
export type SalonLocation = Database['public']['Views']['salon_locations']['Row']
export type LocationAddress = Database['public']['Views']['location_addresses']['Row']
export type SalonChain = Database['organization']['Tables']['salon_chains']['Row']
export type SalonMetric = Database['public']['Views']['salon_metrics']['Row']
export type SalonMedia = Database['public']['Views']['salon_media']['Row']

// Catalog & Settings (Tables - no public views)
export type ServiceCategory = Database['catalog']['Tables']['service_categories']['Row']
export type ServicePricing = Database['catalog']['Tables']['service_pricing']['Row']
export type ServiceProductUsage = Database['inventory']['Tables']['service_product_usage']['Row']
export type BookingRule = Database['catalog']['Tables']['service_booking_rules']['Row']
export type SalonSettings = Database['public']['Views']['salon_settings']['Row']
export type SalonContactDetails = Database['public']['Views']['salon_contact_details']['Row']
export type SalonDescription = Database['public']['Views']['salon_descriptions']['Row']

// Identity (Views available)
export type ProfileMetadata = Database['public']['Views']['profiles_metadata']['Row']
export type ProfilePreference = Database['public']['Views']['profiles_preferences']['Row']

// Analytics (Views available)
export type ManualTransaction = Database['public']['Views']['manual_transactions']['Row']

// Communication (Tables - no public view)
export type WebhookQueue = Database['communication']['Tables']['webhook_queue']['Row']

// ============================================================================
// MUTATION TYPES (For INSERT/UPDATE operations)
// ============================================================================

// Appointments
export type AppointmentInsert = Database['scheduling']['Tables']['appointments']['Insert']
export type AppointmentUpdate = Database['scheduling']['Tables']['appointments']['Update']
export type AppointmentServiceInsert = Database['scheduling']['Tables']['appointment_services']['Insert']

// Other mutations use schema tables as needed
// Add more as required for specific mutations

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface WithClassName {
  className?: string
}

export interface WithChildren {
  children: React.ReactNode
}

export interface WithOptionalChildren {
  children?: React.ReactNode
}

// ============================================================================
// PAGE PROP TYPES
// ============================================================================

export interface PageProps<T = Record<string, string>> {
  params: Promise<T>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export interface LayoutProps<T = Record<string, string>> {
  children: React.ReactNode
  params?: Promise<T>
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface FormState<T = unknown> {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: T
}

// ============================================================================
// REACT EVENT TYPES (Common patterns)
// ============================================================================

export type ButtonClickHandler = React.MouseEvent<HTMLButtonElement>
export type DivClickHandler = React.MouseEvent<HTMLDivElement>
export type FormSubmitHandler = React.FormEvent<HTMLFormElement>
export type InputChangeHandler = React.ChangeEvent<HTMLInputElement>
export type TextAreaChangeHandler = React.ChangeEvent<HTMLTextAreaElement>
export type SelectChangeHandler = React.ChangeEvent<HTMLSelectElement>
export type KeyboardHandler = React.KeyboardEvent<HTMLInputElement>
export type FocusHandler = React.FocusEvent<HTMLInputElement>

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type MaybeNull<T> = T | null | undefined

// Exact subset of fields from a type
export type PickExact<T, K extends keyof T> = Pick<T, K>

// Make specific fields optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Make specific fields required
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

// ============================================================================
// DASHBOARD-SPECIFIC TYPE ALIASES
// ============================================================================

/**
 * Dashboard Type Aliases
 * These provide consistent naming across all portals while maintaining type safety
 * All aliases point to the same underlying view types
 */

// Appointment with all related data (already includes joins in the view)
export type AppointmentView = Appointment
export type AppointmentWithDetails = Appointment
export type AppointmentWithCustomer = Appointment
export type AppointmentWithSalon = Appointment
export type AppointmentWithStaff = Appointment

// Salon with all related data
export type SalonView = Salon
export type SalonWithDetails = Salon

// Staff with all related data
export type StaffView = Staff
export type StaffWithDetails = Staff

// Customer favorites with related data
export type CustomerFavoriteView = CustomerFavorite
export type FavoriteWithDetails = CustomerFavorite

// Profile types
export type ProfileView = Profile
export type UserProfile = Profile

// ============================================================================
// ENUMS (Re-export from Database)
// ============================================================================

export type AppointmentStatus = Database['public']['Enums']['appointment_status']
export type DayOfWeek = Database['public']['Enums']['day_of_week']
export type ThreadPriority = Database['public']['Enums']['thread_priority']
export type ThreadStatus = Database['public']['Enums']['thread_status']
export type PaymentMethod = Database['public']['Enums']['payment_method']
