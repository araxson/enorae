/**
 * Type extensions for database views
 * These extend the base types with additional properties from view joins
 */

import type { Database, Json } from './database.types'
import { format as formatDate } from 'date-fns'

// Extended Salon type with all view properties
export type SalonView = Database['public']['Views']['salons']['Row'] & {
  is_active?: boolean | null
  business_name?: string | null
  description?: string | null
  created_at?: string | null
}

// Extended Staff type with all view properties
export type StaffView = Database['public']['Views']['staff']['Row'] & {
  first_name?: string | null
  last_name?: string | null
  full_name?: string | null
}

// Extended Supplier type
export type SupplierView = {
  id: string
  salon_id: string
  name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  website: string | null
  payment_terms: string | null
  notes: string | null
  is_active: boolean
  products_count?: number
  purchase_orders_count?: number
  created_at: string
  updated_at: string
  created_by_id: string | null
  updated_by_id: string | null
}

// Extended Location type
export type SalonLocationView = {
  id: string
  salon_id: string
  name: string
  slug: string
  is_primary: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  created_by_id: string | null
  updated_by_id: string | null
  deleted_at: string | null
  deleted_by_id: string | null
}

// Extended Preference type
export type ProfilePreferenceView = {
  id: string
  profile_id: string
  locale: string | null
  timezone: string | null
  currency_code: string | null
  country_code: string | null
  preferences: Json
  created_at: string
  updated_at: string
}

// Extended Media type
export type SalonMediaView = {
  salon_id: string
  logo_url: string | null
  cover_image_url: string | null
  gallery_urls: string[] | null
  brand_colors: Json
  social_links: Json
  created_at: string
  updated_at: string
}

// Extended Settings type
export type SalonSettingsView = {
  salon_id: string
  booking_lead_time_hours: number | null
  cancellation_hours: number | null
  max_bookings_per_day: number | null
  is_accepting_bookings: boolean
  subscription_tier: string | null
  subscription_status: string | null
  features: string[] | null
  created_at: string
  updated_at: string
}

// Extended Appointment type with notes
export type AppointmentWithNotes = Database['public']['Views']['appointments']['Row'] & {
  notes?: string | null
}

// Purchase Order type
export type PurchaseOrderView = {
  id: string
  salon_id: string
  supplier_id: string
  order_number: string | null
  ordered_at: string
  expected_delivery_at: string | null
  status: string
  total_amount: number
  notes: string | null
  created_at: string
  updated_at: string
  supplier?: {
    id: string
    name: string
  } | null
  items?: Array<{
    id: string
    product_id: string
    quantity: number
    unit_cost: number
  }> | null
}

// Helper type guards
export function isSalonView(obj: unknown): obj is SalonView {
  return typeof obj === 'object' && obj !== null && 'id' in obj && typeof (obj as Record<string, unknown>).id === 'string'
}

export function hasIsActive(obj: unknown): obj is { is_active: boolean } {
  return typeof obj === 'object' && obj !== null && 'is_active' in obj && typeof (obj as Record<string, unknown>).is_active === 'boolean'
}

// Null-safe helpers
export function formatDateSafe(date: string | null | undefined, formatStr: string = 'MMM d, yyyy'): string {
  if (!date) return 'N/A'
  try {
    return formatDate(new Date(date), formatStr)
  } catch {
    return 'Invalid date'
  }
}

export function getStatusBadge(isActive: boolean | null | undefined): 'Active' | 'Inactive' {
  return isActive === true ? 'Active' : 'Inactive'
}
