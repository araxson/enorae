import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type MostCalledQuery = Database['public']['Views']['most_called_queries_view']['Row']
type SlowQuery = Database['public']['Views']['slow_queries_view']['Row']
type QueryPerformance = Database['public']['Views']['query_performance_summary_view']['Row']

export interface QueryPerformanceSnapshot {
  mostCalledQueries: MostCalledQuery[]
  slowQueries: SlowQuery[]
  indexPerformance: QueryPerformance[]
  summary: {
    totalSlowQueries: number
    totalHighCallQueries: number
    averageQueryTime: number
    worstQueryTime: number
  }
}

export async function getQueryPerformance(
  limit = 50
): Promise<QueryPerformanceSnapshot> {
  const logger = createOperationLogger('getQueryPerformance', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const [mostCalledRes, slowQueriesRes, perfRes] = await Promise.all([
    supabase
      .from('most_called_queries_view')
      .select('query_text, calls, total_time_ms, avg_time_ms')
      .order('calls', { ascending: false })
      .limit(limit),
    supabase
      .from('slow_queries_view')
      .select('query_text, calls, avg_time_ms, max_time_ms, total_time_ms')
      .order('avg_time_ms', { ascending: false })
      .limit(limit),
    supabase
      .from('query_performance_summary_view')
      .select('tablename, index_scans, tuples_read, avg_tuples_per_scan, index_name')
      .order('index_scans', { ascending: false })
      .limit(limit),
  ])

  if (mostCalledRes.error) throw mostCalledRes.error
  if (slowQueriesRes.error) throw slowQueriesRes.error
  if (perfRes.error) throw perfRes.error

  const mostCalledQueries = (mostCalledRes.data ?? []) as unknown as MostCalledQuery[]
  const slowQueries = (slowQueriesRes.data ?? []) as unknown as SlowQuery[]
  const indexPerformance = (perfRes.data ?? []) as unknown as QueryPerformance[]

  const totalSlowQueries = slowQueries.filter(
    (q) => (q['avg_time_ms'] ?? 0) > 100
  ).length
  const totalHighCallQueries = mostCalledQueries.filter(
    (q) => (q['calls'] ?? 0) > 1000
  ).length

  const avgTime =
    slowQueries.reduce((sum, q) => sum + (q['avg_time_ms'] ?? 0), 0) /
    (slowQueries.length || 1)
  const worstTime = Math.max(...slowQueries.map((q) => q['max_time_ms'] ?? 0))

  return {
    mostCalledQueries,
    slowQueries,
    indexPerformance,
    summary: {
      totalSlowQueries,
      totalHighCallQueries,
      averageQueryTime: avgTime,
      worstQueryTime: worstTime,
    },
  }
}
