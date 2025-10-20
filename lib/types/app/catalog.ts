import type { Database } from '../database.types'

export type ServiceCategory = Database['public']['Views']['service_categories_view']['Row']
export type ServicePricing = Database['public']['Views']['service_pricing_view']['Row']
export type ServiceProductUsage = Database['public']['Views']['service_product_usage']['Row']
export type BookingRule = Database['public']['Views']['service_booking_rules_view']['Row']
export type SalonSettings = Database['public']['Views']['salon_settings']['Row']
export type SalonContactDetails = Database['public']['Views']['salon_contact_details']['Row']
export type SalonDescription = Database['public']['Views']['salon_descriptions']['Row']
