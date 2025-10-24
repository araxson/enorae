import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function getAdminClient() {
  const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()
  return { session, supabase }
}
