import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export const MODERATION_PATHS = ['/admin/moderation'] as const

export async function resolveAdminClient() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  return createServiceRoleClient()
}

export async function resolveAdminSession() {
  return requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
}
