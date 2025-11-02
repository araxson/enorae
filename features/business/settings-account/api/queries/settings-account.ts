import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

type Profile = Database['public']['Views']['profiles_view']['Row']

/**
 * Get current user's profile information
 */
export async function getUserProfile(): Promise<Profile> {
  const logger = createOperationLogger('getUserProfile', {})
  logger.start()

  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles_view')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error) throw error
  return data
}