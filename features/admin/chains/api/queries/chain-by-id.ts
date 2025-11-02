import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { SalonChainRow } from '../../types'
import { createOperationLogger } from '@/lib/observability'

export async function getChainById(chainId: string): Promise<SalonChainRow | null> {
  const logger = createOperationLogger('getChainById', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('salon_chains_view')
    .select('*')
    .eq('id', chainId)
    .single<SalonChainRow>()

  if (error) throw error
  return data
}
