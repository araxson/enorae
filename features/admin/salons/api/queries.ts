import 'server-only'

import { differenceInCalendarDays } from 'date-fns'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
type AdminSalonRow = Database['public']['Views']['admin_salons_overview_view']['Row']
type SalonSettingsRow = Database['public']['Views']['salon_settings_view']['Row']
type SalonBaseRow = {
  id: string
  is_verified?: boolean | null
  slug?: string | null
  business_name?: string | null
  business_type?: string | null
}

export type LicenseStatus = 'valid' | 'expiring' | 'expired' | 'unknown'
export type ComplianceLevel = 'low' | 'medium' | 'high'

interface ComplianceInput {
  isVerified: boolean
  licenseStatus: LicenseStatus
  ratingAverage: number | null
  totalBookings: number | null
  totalRevenue: number | null
  staffCount: number | null
}

interface ComplianceResult {
  score: number
  level: ComplianceLevel
  issues: string[]
}

interface HealthInput {
  ratingAverage: number | null
  totalBookings: number | null
  totalRevenue: number | null
  staffCount: number | null
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function computeCompliance(input: ComplianceInput): ComplianceResult {
  const issues: string[] = []
  let score = 80

  if (!input.isVerified) {
    issues.push('Verification pending')
    score -= 20
  }

  switch (input.licenseStatus) {
    case 'expired':
      issues.push('License expired')
      score -= 25
      break
    case 'expiring':
      issues.push('License expiring soon')
      score -= 10
      break
    case 'unknown':
      issues.push('License status unknown')
      score -= 5
      break
  }

  if ((input.ratingAverage ?? 0) < 3) {
    issues.push('Low customer rating')
    score -= 10
  } else if ((input.ratingAverage ?? 0) > 4.5) {
    score += 5
  }

  if ((input.totalBookings ?? 0) < 5) {
    issues.push('Low booking volume')
    score -= 5
  }

  const finalScore = clamp(Math.round(score), 0, 100)
  let level: ComplianceLevel = 'low'

  if (finalScore < 60) level = 'high'
  else if (finalScore < 80) level = 'medium'

  return { score: finalScore, level, issues }
}

function calculateHealthScore({
  ratingAverage,
  totalBookings,
  totalRevenue,
  staffCount,
}: HealthInput): number {
  const ratingScore = clamp((ratingAverage ?? 0) / 5, 0, 1)
  const bookingScore = clamp((totalBookings ?? 0) / 200, 0, 1)
  const revenueScore = clamp((totalRevenue ?? 0) / 150000, 0, 1)
  const staffScore = clamp((staffCount ?? 0) / 50, 0, 1)

  const weighted =
    ratingScore * 0.35 + bookingScore * 0.25 + revenueScore * 0.3 + staffScore * 0.1
  return Math.round(weighted * 100)
}

export type AdminSalon = AdminSalonRow & {
  isVerified: boolean
  licenseStatus: LicenseStatus
  licenseExpiresAt: string | null
  licenseDaysRemaining: number | null
  complianceScore: number
  complianceLevel: ComplianceLevel
  complianceIssues: string[]
  healthScore: number
  staffCapacityRatio: number
  subscriptionTier: string | null
  business_name: string | null
  slug: string | null
  businessType: string | null
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
  highRisk: AdminSalon[]
  expiring: AdminSalon[]
}

export interface SalonsResponse {
  salons: AdminSalon[]
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
  if (base?.['is_verified'] !== undefined && base?.['is_verified'] !== null) {
    return Boolean(base['is_verified'])
  }

  // Fallback heuristic: salons actively taking bookings with healthy metrics are considered verified
  return Boolean(row['is_accepting_bookings'] && (row['total_revenue'] || row['total_bookings'] || 0) > 0)
}

export async function getAllSalons(): Promise<SalonsResponse> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('admin_salons_overview_view')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  const salons = (data || []) as AdminSalonRow[]

  const salonIds = salons.map((salon) => salon['id']).filter(Boolean) as string[]

  const [settingsResult, baseResult] = await Promise.all([
    salonIds.length
      ? supabase
          .from('salon_settings_view')
          .select('salon_id, subscription_expires_at, subscription_tier, is_accepting_bookings, max_staff')
          .in('salon_id', salonIds)
      : { data: [], error: null },
    salonIds.length
      ? supabase
          .from('salons_view')
          .select('id, is_verified, slug, business_name, business_type')
          .in('id', salonIds)
      : { data: [], error: null },
  ])

  if (settingsResult.error) throw settingsResult.error
  if (baseResult.error) throw baseResult.error

  const settingsMap = new Map<string, SalonSettingsRow>(
    ((settingsResult.data as (SalonSettingsRow | null | undefined)[]) || [])
      .filter((row): row is SalonSettingsRow & { salon_id: string } => Boolean(row?.['salon_id']))
      .map((row) => [row['salon_id'], row])
  )
  const baseMap = new Map<string, SalonBaseRow>(
    (baseResult.data as SalonBaseRow[] | null | undefined)?.map((row) => [row['id'], row]) || []
  )

  const adminSalons: AdminSalon[] = salons.map((salon) => {
    const settings = settingsMap.get(salon['id'] ?? '')
    const baseRecord = baseMap.get(salon['id'] ?? '')

    const { status: licenseStatus, days } = deriveLicenseStatus(settings?.subscription_expires_at ?? null)
    const isVerified = deriveVerificationStatus(salon, baseRecord)

    const compliance = computeCompliance({
      isVerified,
      licenseStatus,
      ratingAverage: salon['rating_average'],
      totalBookings: salon['total_bookings'],
      totalRevenue: salon['total_revenue'],
      staffCount: salon['staff_count'],
    })

    const healthScore = calculateHealthScore({
      ratingAverage: salon['rating_average'],
      totalBookings: salon['total_bookings'],
      totalRevenue: salon['total_revenue'],
      staffCount: salon['staff_count'],
    })

    const staffCapacityRatio = settings?.['max_staff']
      ? Math.min((salon['staff_count'] ?? 0) / settings['max_staff'], 2)
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
      subscriptionTier: settings?.['subscription_tier'] ?? null,
      business_name: baseRecord?.['business_name'] ?? null,
      slug: baseRecord?.['slug'] ?? null,
      businessType: baseRecord?.['business_type'] ?? null,
    }
  })

  const verified = adminSalons.filter((salon) => salon.isVerified).length
  const expiring = adminSalons.filter((salon) => salon.licenseStatus === 'expiring' || salon.licenseStatus === 'expired')
  const highRisk = adminSalons.filter((salon) => salon.complianceLevel === 'high')
  const averageCompliance = adminSalons.length
    ? Math.round(
        adminSalons.reduce((total, salon) => total + salon.complianceScore, 0) / adminSalons.length
      )
    : 0
  const byTier = countBy(adminSalons, (salon) => salon.subscriptionTier ?? 'unassigned')
  const byType = countBy(adminSalons, (salon) => salon.businessType ?? 'unknown')

  const stats: SalonDashboardStats = {
    total: adminSalons.length,
    active: adminSalons.filter((salon) => salon['is_accepting_bookings']).length,
    verified,
    expiringLicenses: expiring.length,
    highRisk: highRisk.length,
    averageCompliance,
    byTier,
    byType,
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

  return { salons: adminSalons, stats, insights }
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

function applySalonFilters(salons: AdminSalon[], filters: SalonFilters) {
  return salons.filter((salon) => {
    const matchesChain = !filters['chain_id'] || salon['chain_id'] === filters['chain_id']
    const matchesTier = !filters['subscription_tier'] || salon.subscriptionTier === filters['subscription_tier']
    const matchesSearch = !filters.search
      ? true
      : [salon['name'], salon['business_name'], salon['slug']]
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
