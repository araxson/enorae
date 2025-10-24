import 'server-only'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export interface ToastUsageRecord {
  id: string
  table_name: string
  toast_bytes: number
  table_bytes: number
  toast_percentage: number
  suggested_compression: string | null
}

export interface ToastUsageSnapshot {
  tables: ToastUsageRecord[]
  totalCount: number
  highToastCount: number
  totalToastBytes: number
}

export async function getToastUsage(
  options: { limit?: number; offset?: number } = {},
): Promise<ToastUsageSnapshot> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()
  const limit = options.limit ?? 100
  const offset = options.offset ?? 0

  const { data: tables, error } = await supabase
    .from('toast_usage_summary_view')
    .select('*')
    .order('toast_bytes', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch toast usage:', error)
    return { tables: [], totalCount: 0, highToastCount: 0, totalToastBytes: 0 }
  }

  const { count: totalCount } = await supabase
    .from('toast_usage_summary_view')
    .select('*', { count: 'exact', head: true })

  const { count: highToastCount } = await supabase
    .from('toast_usage_summary_view')
    .select('*', { count: 'exact', head: true })
    .gt('toast_percentage', 20)

  const totalToastBytes =
    tables && tables.length > 0
      ? (tables as any[]).reduce((sum, t) => sum + t.toast_bytes, 0)
      : 0

  return {
    tables: (tables as ToastUsageRecord[]) ?? [],
    totalCount: totalCount ?? 0,
    highToastCount: highToastCount ?? 0,
    totalToastBytes,
  }
}
