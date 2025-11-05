import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export const getSupabaseClient = () => createServiceRoleClient()

export async function ensurePlatformAdmin(): Promise<{ user: { id: string; email?: string } }> {
  const logger = createOperationLogger('ensurePlatformAdmin', {})
  logger.start()

  return requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
}
