import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole } from '@/lib/auth/role-guard'
import { ROLE_GROUPS } from '@/lib/auth/constants'

export interface QueryPerformanceRecord {
  id: string
  query_hash: string
  query_sample: string
  mean_time_ms: number
  max_time_ms: number
  call_count: number
  buffer_usage_bytes: number
  recommended_index: string | null
}

export interface PerformanceSnapshot {
  queries: QueryPerformanceRecord[]
  totalCount: number
  slowQueryCount: number
  avgMeanTime: number
}

export async function getQueryPerformance(
  options: { limit?: number; offset?: number } = {},
): Promise<PerformanceSnapshot> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()
  const limit = options.limit ?? 50
  const offset = options.offset ?? 0

  const { data: queries, error } = await supabase
    .from('query_performance_summary_view')
    .select('*')
    .order('mean_time_ms', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch query performance:', error)
    return { queries: [], totalCount: 0, slowQueryCount: 0, avgMeanTime: 0 }
  }

  const { count: totalCount } = await supabase
    .from('query_performance_summary_view')
    .select('*', { count: 'exact', head: true })

  const { count: slowQueryCount } = await supabase
    .from('query_performance_summary_view')
    .select('*', { count: 'exact', head: true })
    .gt('mean_time_ms', 100)

  const avgMeanTime =
    queries && queries.length > 0
      ? (queries as any[]).reduce((sum, q) => sum + q.mean_time_ms, 0) / queries.length
      : 0

  return {
    queries: (queries as QueryPerformanceRecord[]) ?? [],
    totalCount: totalCount ?? 0,
    slowQueryCount: slowQueryCount ?? 0,
    avgMeanTime: Math.round(avgMeanTime),
  }
}
