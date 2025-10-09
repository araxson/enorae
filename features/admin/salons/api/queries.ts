import 'server-only'

import { differenceInCalendarDays } from 'date-fns'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import {
  calculateHealthScore,
  computeCompliance,
  type LicenseStatus,
  type ComplianceLevel,
} from '../utils/scoring'

type AdminSalonRow = Database['public']['Views']['admin_salons_overview']['Row']
type SalonSettingsRow = Database['organization']['Tables']['salon_settings']['Row']
type SalonBaseRow = { id: string; is_verified?: boolean | null }

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

function deriveLicenseStatus(expiresAt: string | null): { status: LicenseStatus; days: number | null } {
  if (!expiresAt) return { status: 'unknown', days: null }
  const days = differenceInCalendarDays(new Date(expiresAt), new Date())
  if (days < 0) return { status: 'expired', days }
  if (days <= 30) return { status: 'expiring', days }
  return { status: 'valid', days }
}

function deriveVerificationStatus(row: AdminSalonRow, base: SalonBaseRow | undefined): boolean {
  if (base?.is_verified !== undefined && base?.is_verified !== null) {
    return Boolean(base.is_verified)
  }

  // Fallback heuristic: salons actively taking bookings with healthy metrics are considered verified
  return Boolean(row.is_accepting_bookings && (row.total_revenue || row.total_bookings || 0) > 0)
}

export async function getAllSalons(): Promise<SalonsResponse> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_salons_overview')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  const salons = (data || []) as AdminSalonRow[]

  const salonIds = salons.map((salon) => salon.id).filter(Boolean) as string[]

  const [settingsResult, baseResult] = await Promise.all([
    salonIds.length
      ? supabase
          .from('salon_settings')
          .select('salon_id, subscription_expires_at, is_accepting_bookings, max_staff')
          .in('salon_id', salonIds)
      : { data: [], error: null },
    salonIds.length
      ? supabase
          .from('salons')
          .select('id, is_verified')
          .in('id', salonIds)
      : { data: [], error: null },
  ])

  if (settingsResult.error) throw settingsResult.error
  if (baseResult.error) throw baseResult.error

  const settingsMap = new Map<string, SalonSettingsRow>(
    (settingsResult.data as SalonSettingsRow[] | null | undefined)?.map((row) => [row.salon_id, row]) || []
  )
  const baseMap = new Map<string, SalonBaseRow>(
    (baseResult.data as SalonBaseRow[] | null | undefined)?.map((row) => [row.id, row]) || []
  )

  const enhancedSalons: EnhancedSalon[] = salons.map((salon) => {
    const settings = settingsMap.get(salon.id ?? '')
    const baseRecord = baseMap.get(salon.id ?? '')

    const { status: licenseStatus, days } = deriveLicenseStatus(settings?.subscription_expires_at ?? null)
    const isVerified = deriveVerificationStatus(salon, baseRecord)

    const compliance = computeCompliance({
      isVerified,
      licenseStatus,
      ratingAverage: salon.rating_average,
      totalBookings: salon.total_bookings,
      totalRevenue: salon.total_revenue,
      employeeCount: salon.employee_count,
      maxStaff: settings?.max_staff ?? salon.max_staff,
    })

    const healthScore = calculateHealthScore({
      ratingAverage: salon.rating_average,
      totalBookings: salon.total_bookings,
      totalRevenue: salon.total_revenue,
      employeeCount: salon.employee_count,
      maxStaff: settings?.max_staff ?? salon.max_staff,
    })

    const staffCapacityRatio = settings?.max_staff
      ? Math.min((salon.employee_count ?? 0) / settings.max_staff, 2)
      : 0

    return {
      ...salon,
      isVerified,
      licenseStatus,
      licenseExpiresAt: settings?.subscription_expires_at ?? null,
      licenseDaysRemaining: days,
      complianceScore: compliance.score,
      complianceLevel: compliance.level,
      complianceIssues: compliance.issues,
      healthScore,
      staffCapacityRatio,
    }
  })

  const verified = enhancedSalons.filter((salon) => salon.isVerified).length
  const expiring = enhancedSalons.filter((salon) => salon.licenseStatus === 'expiring' || salon.licenseStatus === 'expired')
  const highRisk = enhancedSalons.filter((salon) => salon.complianceLevel === 'high')
  const averageCompliance = enhancedSalons.length
    ? Math.round(
        enhancedSalons.reduce((total, salon) => total + salon.complianceScore, 0) / enhancedSalons.length
      )
    : 0

  const stats: SalonDashboardStats = {
    total: enhancedSalons.length,
    active: enhancedSalons.filter((salon) => salon.is_accepting_bookings).length,
    verified,
    expiringLicenses: expiring.length,
    highRisk: highRisk.length,
    averageCompliance,
    byTier: countBy(enhancedSalons, (salon) => salon.subscription_tier || 'free'),
    byType: countBy(enhancedSalons, (salon) => salon.business_type || 'salon'),
  }

  const insights: SalonInsights = {
    highRisk: highRisk
      .slice()
      .sort((a, b) => a.complianceScore - b.complianceScore)
      .slice(0, 6),
    expiring: expiring
      .slice()
      .sort((a, b) => (a.licenseDaysRemaining ?? 999) - (b.licenseDaysRemaining ?? 999))
      .slice(0, 6),
  }

  return { salons: enhancedSalons, stats, insights }
}

export interface SalonFilters {
  chain_id?: string
  subscription_tier?: string
  search?: string
  is_deleted?: boolean
}

// Compatibility export for existing call sites
export async function getAllSalonsLegacy(filters?: SalonFilters) {
  const { salons, stats } = await getAllSalons()

  const filtered = (filters ? applySalonFilters(salons, filters) : salons)
  return { salons: filtered, stats }
}

function applySalonFilters(salons: EnhancedSalon[], filters: SalonFilters) {
  return salons.filter((salon) => {
    const matchesChain = !filters.chain_id || salon.chain_id === filters.chain_id
    const matchesTier = !filters.subscription_tier || salon.subscription_tier === filters.subscription_tier
    const matchesSearch = !filters.search
      ? true
      : [salon.name, salon.business_name, salon.slug]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(filters.search!.toLowerCase()))

    return matchesChain && matchesTier && matchesSearch
  })
}

function countBy<T>(items: T[], selector: (item: T) => string) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = selector(item)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}
