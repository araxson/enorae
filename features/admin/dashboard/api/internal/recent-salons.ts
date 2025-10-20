import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { logSupabaseError } from '@/lib/supabase/errors'
import type { AdminSalon } from './types'

export async function getRecentSalons(): Promise<AdminSalon[]> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  // Use admin_salons_overview for enriched salon data
  const { data, error } = await supabase
    .from('admin_salons_overview')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    logSupabaseError('getRecentSalons', error)
    return []
  }
  return (data || []) as AdminSalon[]
}
