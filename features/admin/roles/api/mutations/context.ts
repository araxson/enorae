'use server'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

export async function requireAdminContext() {
  const logger = createOperationLogger('requireAdminContext', {})
  logger.start()

  const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()
  return { session, supabase }
}

export async function requireSuperAdminContext() {
  const session = await requireAnyRole(['super_admin'])
  const supabase = createServiceRoleClient()
  return { session, supabase }
}
