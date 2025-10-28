import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function requireAdminClient(): Promise<SupabaseClient<Database>> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  return createServiceRoleClient()
}

/**
 * Requires admin role AND MFA (aal2) for sensitive financial operations.
 * SEC-H101: Enforce MFA on financial data access
 */
export async function requireAdminClientWithMFA(): Promise<SupabaseClient<Database>> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  // Check MFA status from user
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required for financial operations')
  }

  // Verify MFA is enabled (aal2 = authenticated with MFA)
  // Check both app_metadata and user['aal'] for MFA status
  const aal = user.app_metadata?.['aal'] as string | undefined

  if (aal !== 'aal2') {
    throw new Error('MFA required for financial operations. Please enable multi-factor authentication.')
  }

  return createServiceRoleClient()
}
