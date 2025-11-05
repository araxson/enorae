import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { SalonChainRow } from '../../api/types'
import { createOperationLogger } from '@/lib/observability'

export async function getChainById(chainId: string): Promise<SalonChainRow | null> {
  const logger = createOperationLogger('getChainById', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('salon_chains_view')
    .select('id, name, slug, description, owner_id, owner_email, subscription_tier, subscription_status, total_salons, total_staff, total_revenue, is_verified, is_active, created_at, updated_at')
    .eq('id', chainId)
    .single<SalonChainRow>()

  if (error) throw error
  return data
}
