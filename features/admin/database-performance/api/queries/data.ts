import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

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
    .select('tablename, avg_tuples_per_scan, tuples_read, index_scans, index_name')
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
      ? queries.reduce((sum: number, q) => sum + (typeof q === 'object' && q !== null && 'mean_time_ms' in q && typeof q.mean_time_ms === 'number' ? q.mean_time_ms : 0), 0) / queries.length
      : 0

  // Map view results to QueryPerformanceRecord type (view has different columns)
  const mappedQueries: QueryPerformanceRecord[] = (queries ?? []).map(q => ({
    id: typeof q === 'object' && q !== null && 'tablename' in q ? String(q.tablename || '') : '',
    query_hash: typeof q === 'object' && q !== null && 'tablename' in q ? String(q.tablename || '') : '',
    query_sample: typeof q === 'object' && q !== null && 'tablename' in q ? String(q.tablename || '') : '',
    mean_time_ms: typeof q === 'object' && q !== null && 'avg_tuples_per_scan' in q ? Number(q.avg_tuples_per_scan) : 0,
    max_time_ms: typeof q === 'object' && q !== null && 'tuples_read' in q ? Number(q.tuples_read) : 0,
    call_count: typeof q === 'object' && q !== null && 'index_scans' in q ? Number(q.index_scans) : 0,
    buffer_usage_bytes: 0,
    recommended_index: typeof q === 'object' && q !== null && 'index_name' in q ? String(q.index_name || null) : null,
  }))

  return {
    queries: mappedQueries,
    totalCount: totalCount ?? 0,
    slowQueryCount: slowQueryCount ?? 0,
    avgMeanTime: Math.round(avgMeanTime),
  }
}
