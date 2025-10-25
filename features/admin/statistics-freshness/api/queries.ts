import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export interface StatsFreshnessRecord {
  id: string
  table_name: string
  last_analyze: string
  row_estimate: number
  dead_rows: number
  maintenance_recommended: boolean
}

export interface StatsFreshnessSnapshot {
  tables: StatsFreshnessRecord[]
  totalCount: number
  staleCount: number
}

export async function getStatisticsFreshness(
  options: { limit?: number; offset?: number } = {},
): Promise<StatsFreshnessSnapshot> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()
  const limit = options.limit ?? 100
  const offset = options.offset ?? 0

  const { data: tables, error } = await supabase
    .from('statistics_freshness_view')
    .select('*')
    .order('last_analyze', { ascending: true })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch statistics freshness:', error)
    return { tables: [], totalCount: 0, staleCount: 0 }
  }

  const { count: totalCount } = await supabase
    .from('statistics_freshness_view')
    .select('*', { count: 'exact', head: true })

  const { count: staleCount } = await supabase
    .from('statistics_freshness_view')
    .select('*', { count: 'exact', head: true })
    .eq('maintenance_recommended', true)

  return {
    tables: (tables as StatsFreshnessRecord[]) ?? [],
    totalCount: totalCount ?? 0,
    staleCount: staleCount ?? 0,
  }
}
