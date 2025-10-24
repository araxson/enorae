import type { Database } from '@/lib/types/database.types'

/**
 * Location and organization types
 * Used by location and salon management features
 */

// Database views
export type SalonLocation = Database['public']['Views']['salon_locations']['Row']
export type LocationAddress = Database['public']['Views']['location_addresses']['Row']
export type SalonChain = Database['public']['Views']['salon_chains_view']['Row']
export type SalonMetric = Database['public']['Views']['salon_metrics']['Row']
export type SalonMedia = Database['public']['Views']['salon_media_view']['Row']
