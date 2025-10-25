import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Optimization = Database['public']['Views']['low_priority_optimizations_summary']['Row']
type StatsFreshness = Database['public']['Views']['statistics_freshness']['Row']
type UnusedIndex = Database['public']['Views']['unused_indexes']['Row']

export interface OptimizationSnapshot {
  recommendations: Optimization[]
  statisticsFreshness: StatsFreshness[]
  unusedIndexes: UnusedIndex[]
  summary: {
    totalRecommendations: number
    criticalRecommendations: number
    staleStatistics: number
    unusedIndexCount: number
    potentialSpaceSavings: number
  }
}

export async function getOptimizationRecommendations(
  limit = 100
): Promise<OptimizationSnapshot> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const [optimizationsRes, statsRes, indexesRes] = await Promise.all([
    supabase.from('low_priority_optimizations_summary').select('*').limit(limit),
    supabase
      .from('statistics_freshness')
      .select('*')
      .order('last_analyze', { ascending: true })
      .limit(limit),
    supabase
      .from('unused_indexes')
      .select('*')
      .order('idx_scan', { ascending: true })
      .limit(limit),
  ])

  if (optimizationsRes.error) throw optimizationsRes.error
  if (statsRes.error) throw statsRes.error
  if (indexesRes.error) throw indexesRes.error

  const recommendations = (optimizationsRes.data ?? []) as Optimization[]
  const statisticsFreshness = (statsRes.data ?? []) as StatsFreshness[]
  const unusedIndexes = (indexesRes.data ?? []) as UnusedIndex[]

  const criticalRecommendations = recommendations.filter(
    (r) => r['status'] === 'critical' || r['status'] === 'high'
  ).length

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const staleStatistics = statisticsFreshness.filter((s) => {
    const lastAnalyze = s['last_analyze'] ? new Date(s['last_analyze']) : null
    return !lastAnalyze || lastAnalyze < sevenDaysAgo
  }).length

  const unusedIndexCount = unusedIndexes.filter(
    (idx) => (idx['scans'] ?? 0) === 0
  ).length

  // Estimate space savings from unused indexes (count of unused)
  const potentialSpaceSavings = unusedIndexCount

  return {
    recommendations,
    statisticsFreshness,
    unusedIndexes,
    summary: {
      totalRecommendations: recommendations.length,
      criticalRecommendations,
      staleStatistics,
      unusedIndexCount,
      potentialSpaceSavings,
    },
  }
}
