import type { Database } from '@/lib/types/database.types'

export type Salon = Database['public']['Views']['salons_view']['Row']
export type Service = Database['public']['Views']['services_view']['Row']
export type OperatingHours = Database['public']['Views']['operating_hours_view']['Row']
export type SalonContactDetails = Database['public']['Views']['salon_contact_details_view']['Row']
export type SalonDescription = Database['public']['Views']['salon_descriptions_view']['Row']
export type SalonMediaView = Database['public']['Views']['salon_media_view']['Row']
export type LocationAddress = Database['public']['Views']['location_addresses_view']['Row']
