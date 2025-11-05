import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getUserSalonIds, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'
import type { Database } from '@/lib/types/database.types'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SCHEDULING_SCHEMA = 'scheduling'

export async function resolveClient(): Promise<SupabaseClient<Database>> {
  const logger = createOperationLogger('resolveClient', {})
  logger.start()

  return createClient()
}

export async function resolveSessionRoles(): Promise<Awaited<ReturnType<typeof requireAnyRole>>> {
  return requireAnyRole([...ROLE_GROUPS.BUSINESS_USERS, ...ROLE_GROUPS.STAFF_USERS])
}

export async function ensureSalonAccess(targetSalonId: string): Promise<void> {
  const accessibleSalonIds = await getUserSalonIds()
  if (!accessibleSalonIds.includes(targetSalonId)) {
    throw new Error('Unauthorized: Not your salon')
  }
}

export const BLOCKED_TIMES_TABLE = `${SCHEDULING_SCHEMA}.blocked_times`
export const BLOCKED_TIMES_PATHS = ['/business/blocked-times', '/staff/schedule'] as const
