import type { Database } from '@/lib/types/database.types'

export type SalonLocation = Database['public']['Views']['salon_locations']['Row']
export type LocationAddress = Database['public']['Views']['location_addresses']['Row']

export type StaffLocationDetail = SalonLocation & {
  location_name?: string | null
  salon_name?: string | null
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state_province?: string | null
  postal_code?: string | null
  country_code?: string | null
  phone_number?: string | null
  email?: string | null
  accessibility_notes?: string | null
}
