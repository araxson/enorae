/**
 * Database Type Helpers
 *
 * Extended types for database views that include optional computed/extended properties
 * that may be added during data transformation or denormalization
 */

import type { Database } from './database.types'

// Salon-related extended types
type BaseSalon = Database['public']['Views']['salons']['Row']
export type ExtendedSalon = BaseSalon & {
  // Extended properties that may be added via transformation
  services_count?: number | null
  staff_count?: number | null
  established_at?: string | null
  specialties?: string[] | null
  rating?: number | null
  review_count?: number | null
  amenities?: string[] | null
  payment_methods?: string[] | null
  languages_spoken?: string[] | null
  certifications?: string[] | null
  awards?: string[] | null
  is_featured?: boolean | null
  cover_image_url?: string | null
  logo_url?: string | null
}

type BaseSalonDescription = Database['public']['Views']['salon_descriptions']['Row']
export type ExtendedSalonDescription = BaseSalonDescription & {
  // Extended properties for descriptions
  amenities?: string[] | null
  specialties?: string[] | null
  certifications?: string[] | null
  awards?: string[] | null
}

// Review-related extended types
// Note: salon_reviews may not exist as a view, using generic review type
export type ExtendedReview = {
  // Extended review properties
  id?: string
  value_rating?: number | null
  service_quality_rating?: number | null
  cleanliness_rating?: number | null
  business_name?: string | null
  author_name?: string | null
  title?: string | null
  content?: string | null
  rating?: number | null
}

// Appointment-related extended types
export type ExtendedAppointment = {
  // Extended appointment properties
  id?: string
  salon_name?: string | null
  service_names?: string[] | null
  staff_name?: string | null
  status?: string | null
  start_time?: string | null
  created_at?: string | null
}

// Staff-related extended types
export type ExtendedStaff = {
  // Extended staff properties
  id?: string
  specialties?: string[] | null
  certifications?: string[] | null
  awards?: string[] | null
  languages_spoken?: string[] | null
  salon_name?: string | null
}

// Service-related extended types
export type ExtendedService = {
  // Extended service properties
  id?: string
  category_name?: string | null
  salon_name?: string | null
}
