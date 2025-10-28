import type { Database } from '@/lib/types/database.types'

export type SalonChainRow = Database['public']['Views']['salon_chains_view']['Row']
export type AdminSalonOverviewRow = Database['public']['Views']['admin_salons_overview_view']['Row']
export type AdminRevenueOverviewRow = Database['public']['Views']['admin_revenue_overview_view']['Row']
export type SalonLocationRow = Database['public']['Views']['salon_locations_view']['Row']
export type LocationAddressRow = Database['public']['Views']['location_addresses_view']['Row']

export interface ChainAnalytics {
  chainId: string
  chainName: string
  totalSalons: number
  totalStaff: number
  totalRevenue: number
  totalAppointments: number
  avgRating: number
  verificationStatus: boolean
  subscriptionTier: string | null
}

export interface ChainSalon {
  id: string
  name: string
  city: string | null
  state: string | null
  isAcceptingBookings: boolean
  ratingAverage: number | null
  ratingCount: number
  createdAt: string | null
}

export interface ChainCompliance {
  chainId: string
  chainName: string
  totalSalons: number
  verifiedSalons: number
  unverifiedSalons: number
  complianceRate: number
  issues: string[]
}
