import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { logSupabaseError } from '@/lib/supabase/errors'
import type { AdminSalon } from '@/features/admin/salons'
import { createOperationLogger } from '@/lib/observability'

export async function getRecentSalons(): Promise<AdminSalon[]> {
  const logger = createOperationLogger('getRecentSalons', {})
  logger.start()

  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  // Use salons_view for enriched salon data
  const { data, error } = await supabase
    .from('salons_view')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
    .returns<AdminSalon[]>()

  if (error) {
    logSupabaseError('getRecentSalons', error)
    return []
  }
  return data ?? []
}
