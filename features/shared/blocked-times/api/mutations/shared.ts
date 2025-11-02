import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getUserSalonIds, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SCHEDULING_SCHEMA = 'scheduling'

export async function resolveClient() {
  const logger = createOperationLogger('resolveClient', {})
  logger.start()

  return createClient()
}

export async function resolveSessionRoles() {
  return requireAnyRole([...ROLE_GROUPS.BUSINESS_USERS, ...ROLE_GROUPS.STAFF_USERS])
}

export async function ensureSalonAccess(targetSalonId: string) {
  const accessibleSalonIds = await getUserSalonIds()
  if (!accessibleSalonIds.includes(targetSalonId)) {
    throw new Error('Unauthorized: Not your salon')
  }
}

export const BLOCKED_TIMES_TABLE = `${SCHEDULING_SCHEMA}.blocked_times`
export const BLOCKED_TIMES_PATHS = ['/business/blocked-times', '/staff/schedule'] as const
