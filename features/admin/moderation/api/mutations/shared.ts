import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

// Re-export constants from constants.ts
export { UUID_REGEX, MODERATION_PATHS } from '../../constants'

export async function resolveAdminClient() {
  const logger = createOperationLogger('resolveAdminClient', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  return createServiceRoleClient()
}

export async function resolveAdminSession() {
  return requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
}
