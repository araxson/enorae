import type { Database } from '@/lib/types/database.types'

/**
 * Service catalog types
 * Used by service and catalog management features
 */

// Database views
export type Service = Database['public']['Views']['services']['Row']
export type ServiceCategory = Database['public']['Views']['service_categories_view']['Row']
export type ServicePricing = Database['public']['Views']['service_pricing_view']['Row']
export type BookingRule = Database['public']['Views']['service_booking_rules_view']['Row']
export type SalonSettings = Database['public']['Views']['salon_settings']['Row']
export type SalonContactDetails = Database['public']['Views']['salon_contact_details']['Row']
export type SalonDescription = Database['public']['Views']['salon_descriptions']['Row']

// Component props
export interface ServicesManagementClientProps {
  salon: { id: string }
  services: Service[]
}
