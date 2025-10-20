import type { Database } from '../database.types'

export type Salon = Database['public']['Views']['salons']['Row']
export type SalonView = Salon
export type AdminSalon = Database['public']['Views']['admin_salons_overview']['Row']
export type SalonLocation = Database['public']['Views']['salon_locations']['Row']
export type LocationAddress = Database['public']['Views']['location_addresses']['Row']
export type SalonChain = Database['public']['Views']['salon_chains_view']['Row']
export type SalonMetric = Database['public']['Views']['salon_metrics']['Row']
export type SalonMedia = Database['public']['Views']['salon_media_view']['Row']

export type Staff = Database['public']['Views']['staff']['Row']
export type StaffView = Staff
