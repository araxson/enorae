import type { Database } from '@/lib/types/database.types'

export type AdminSalonRow = Database['public']['Views']['admin_salons_overview_view']['Row']
export type SalonSettingsRow = Database['organization']['Tables']['salon_settings']['Row']
export type SalonBaseRow = { id: string; is_verified?: boolean | null }

export type LicenseStatus = 'valid' | 'expiring' | 'expired' | 'unknown'
export type ComplianceLevel = 'low' | 'medium' | 'high'

export interface ComplianceInput {
  isVerified: boolean
  licenseStatus: LicenseStatus
  ratingAverage: number | null
  totalBookings: number | null
  totalRevenue: number | null
  employeeCount: number | null
  maxStaff: number | null
}

export interface ComplianceResult {
  score: number
  level: ComplianceLevel
  issues: string[]
}

export interface HealthInput {
  ratingAverage: number | null
  totalBookings: number | null
  totalRevenue: number | null
  employeeCount: number | null
  maxStaff: number | null
}

export type EnhancedSalon = AdminSalonRow & {
  isVerified: boolean
  licenseStatus: LicenseStatus
  licenseExpiresAt: string | null
  licenseDaysRemaining: number | null
  complianceScore: number
  complianceLevel: ComplianceLevel
  complianceIssues: string[]
  healthScore: number
  staffCapacityRatio: number
  subscription_tier: string | null
  business_type: string | null
  employee_count: number | null
  max_staff_capacity: number | null
  business_name: string | null
  chain_name: string | null
  owner_name: string | null
  slug: string | null
}

export interface SalonDashboardStats {
  total: number
  active: number
  verified: number
  expiringLicenses: number
  highRisk: number
  averageCompliance: number
  byTier: Record<string, number>
  byType: Record<string, number>
}

export interface SalonInsights {
  highRisk: EnhancedSalon[]
  expiring: EnhancedSalon[]
}

export interface SalonsResponse {
  salons: EnhancedSalon[]
  stats: SalonDashboardStats
  insights: SalonInsights
}

export interface SalonFilters {
  chain_id?: string
  subscription_tier?: string
  search?: string
  is_deleted?: boolean
}
