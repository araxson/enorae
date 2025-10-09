import type { Database } from '../database.types'

export type ServiceCategory = Database['catalog']['Tables']['service_categories']['Row']
export type ServicePricing = Database['catalog']['Tables']['service_pricing']['Row']
export type ServiceProductUsage = Database['inventory']['Tables']['service_product_usage']['Row']
export type BookingRule = Database['catalog']['Tables']['service_booking_rules']['Row']
export type SalonSettings = Database['public']['Views']['salon_settings']['Row']
export type SalonContactDetails = Database['public']['Views']['salon_contact_details']['Row']
export type SalonDescription = Database['public']['Views']['salon_descriptions']['Row']
