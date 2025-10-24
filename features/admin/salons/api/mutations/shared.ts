import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export const getSupabaseClient = () => createServiceRoleClient()

export async function ensurePlatformAdmin() {
  return requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
}
