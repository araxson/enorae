import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type TableBloat = Database['public']['Views']['table_bloat_estimate_view']['Row']
type CacheHitRatio = Database['public']['Views']['table_cache_hit_ratio_view']['Row']
type HotUpdateStats = Database['public']['Views']['hot_update_stats_view']['Row']
type ToastUsage = Database['public']['Views']['toast_usage_summary_view']['Row']

export interface DatabaseHealthSnapshot {
  bloatedTables: TableBloat[]
  cachePerformance: CacheHitRatio[]
  hotUpdateStats: HotUpdateStats[]
  toastUsage: ToastUsage[]
  summary: {
    totalBloatedTables: number
    averageCacheHitRatio: number
    lowCacheHitTables: number
    hotUpdateIssues: number
  }
}

export async function getDatabaseHealth(
  limit = 50
): Promise<DatabaseHealthSnapshot> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const [bloatRes, cacheRes, hotUpdateRes, toastRes] = await Promise.all([
    supabase
      .from('table_bloat_estimate_view')
      .select('*')
      .order('dead_tuple_percent', { ascending: false })
      .limit(limit),
    supabase
      .from('table_cache_hit_ratio_view')
      .select('*')
      .order('cache_hit_ratio', { ascending: true })
      .limit(limit),
    supabase
      .from('hot_update_stats_view')
      .select('*')
      .order('hot_update_percentage', { ascending: false })
      .limit(limit),
    supabase
      .from('toast_usage_summary_view')
      .select('*')
      .order('toast_index_percentage', { ascending: false })
      .limit(limit),
  ])

  if (bloatRes.error) throw bloatRes.error
  if (cacheRes.error) throw cacheRes.error
  if (hotUpdateRes.error) throw hotUpdateRes.error
  if (toastRes.error) throw toastRes.error

  const bloatedTables = (bloatRes.data ?? []) as TableBloat[]
  const cachePerformance = (cacheRes.data ?? []) as CacheHitRatio[]
  const hotUpdateStats = (hotUpdateRes.data ?? []) as HotUpdateStats[]
  const toastUsage = (toastRes.data ?? []) as ToastUsage[]

  const totalBloatedTables = bloatedTables.filter(
    (t) => (t['dead_tuple_percent'] ?? 0) > 10
  ).length
  const lowCacheHitTables = cachePerformance.filter(
    (t) => (t['cache_hit_ratio'] ?? 100) < 90
  ).length
  const hotUpdateIssues = hotUpdateStats.filter(
    (t) => t['status'] === 'warning' || t['status'] === 'critical'
  ).length

  const avgCacheHit =
    cachePerformance.reduce((sum, t) => sum + (t['cache_hit_ratio'] ?? 0), 0) /
    (cachePerformance.length || 1)

  return {
    bloatedTables,
    cachePerformance,
    hotUpdateStats,
    toastUsage,
    summary: {
      totalBloatedTables,
      averageCacheHitRatio: avgCacheHit,
      lowCacheHitTables,
      hotUpdateIssues,
    },
  }
}
