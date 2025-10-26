import type { Database } from '@/lib/types/database.types'

/**
 * Location and organization types
 * Used by location and salon management features
 */

// Database views (using actual view names from schema)
export type SalonLocation = Database['public']['Views']['salon_locations_view']['Row']
export type LocationAddress = Database['public']['Views']['location_addresses_view']['Row']
export type SalonChain = Database['public']['Views']['salon_chains_view']['Row']
export type SalonMetric = Database['organization']['Views']['salon_metrics_with_counts_view']['Row']
export type SalonMedia = Database['public']['Views']['salon_media_view']['Row']
