import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

// Re-export constants from constants.ts
export { UUID_REGEX, MODERATION_PATHS } from './constants'

export async function resolveAdminClient() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  return createServiceRoleClient()
}

export async function resolveAdminSession() {
  return requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
}
