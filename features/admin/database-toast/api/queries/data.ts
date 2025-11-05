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
    .select('tablename, main_size, toast_and_index_size, total_size, toast_index_percentage')
    .order('toast_bytes', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch toast usage:', error)
    return { tables: [], totalCount: 0, highToastCount: 0, totalToastBytes: 0 }
  }

  const { count: totalCount } = await supabase
    .from('toast_usage_summary_view')
    .select('tablename', { count: 'exact', head: true })

  const { count: highToastCount } = await supabase
    .from('toast_usage_summary_view')
    .select('tablename', { count: 'exact', head: true })
    .gt('toast_percentage', 20)

  const totalToastBytes =
    tables && tables.length > 0
      ? tables.reduce((sum: number, t) => sum + (typeof t === 'object' && t !== null && 'toast_and_index_size' in t && typeof t.toast_and_index_size === 'string' ? parseInt(t.toast_and_index_size) : 0), 0)
      : 0

  // Map view results to ToastUsageRecord type (view has different columns)
  const mappedTables: ToastUsageRecord[] = (tables ?? []).map(t => ({
    id: typeof t === 'object' && t !== null && 'tablename' in t ? String(t.tablename || '') : '',
    table_name: typeof t === 'object' && t !== null && 'tablename' in t ? String(t.tablename || '') : '',
    toast_bytes: typeof t === 'object' && t !== null && 'toast_and_index_size' in t ? parseInt(String(t.toast_and_index_size || '0')) : 0,
    table_bytes: typeof t === 'object' && t !== null && 'main_size' in t ? parseInt(String(t.main_size || '0')) : 0,
    toast_percentage: typeof t === 'object' && t !== null && 'toast_index_percentage' in t ? Number(t.toast_index_percentage || 0) : 0,
    suggested_compression: typeof t === 'object' && t !== null && 'total_size' in t ? 'pglz' : null,
  }))

  return {
    tables: mappedTables,
    totalCount: totalCount ?? 0,
    highToastCount: highToastCount ?? 0,
    totalToastBytes,
  }
}
