import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type TableWithoutRLS = Database['public']['Views']['public_tables_without_rls']['Row']
type TableWithoutPK = Database['public']['Views']['tables_without_primary_keys']['Row']

export interface SchemaValidationSnapshot {
  tablesWithoutRLS: TableWithoutRLS[]
  tablesWithoutPK: TableWithoutPK[]
  summary: {
    totalRLSIssues: number
    totalPKIssues: number
    criticalSecurityIssues: number
  }
}

export async function getSchemaValidation(): Promise<SchemaValidationSnapshot> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const [rlsRes, pkRes] = await Promise.all([
    supabase
      .from('public_tables_without_rls')
      .select('*')
      .order('schemaname', { ascending: true }),
    supabase
      .from('tables_without_primary_keys')
      .select('*')
      .order('schema_name', { ascending: true }),
  ])

  if (rlsRes.error) throw rlsRes.error
  if (pkRes.error) throw pkRes.error

  const tablesWithoutRLS = (rlsRes.data ?? []) as TableWithoutRLS[]
  const tablesWithoutPK = (pkRes.data ?? []) as TableWithoutPK[]

  const criticalSecurityIssues = tablesWithoutRLS.filter(
    (t) => t.rls_status === 'disabled' || t.rls_status === 'missing'
  ).length

  return {
    tablesWithoutRLS,
    tablesWithoutPK,
    summary: {
      totalRLSIssues: tablesWithoutRLS.length,
      totalPKIssues: tablesWithoutPK.length,
      criticalSecurityIssues,
    },
  }
}
