import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function requireAdminClient(): Promise<ReturnType<typeof createServiceRoleClient>> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  return createServiceRoleClient()
}
