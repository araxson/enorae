import type { Database } from '@/lib/types/database.types'

export type Salon = Database['public']['Views']['salons']['Row']
export type Service = Database['public']['Views']['services']['Row']
export type OperatingHours = Database['public']['Views']['operating_hours']['Row']
export type SalonContactDetails = Database['public']['Views']['salon_contact_details']['Row']
export type SalonDescription = Database['public']['Views']['salon_descriptions']['Row']
export type SalonMediaView = Database['public']['Views']['salon_media_view']['Row']
export type LocationAddress = Database['public']['Views']['location_addresses']['Row']
