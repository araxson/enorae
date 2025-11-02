import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { SalonChainRow } from '../../types'
import { createOperationLogger } from '@/lib/observability/logger'

export async function getAllSalonChains(): Promise<SalonChainRow[]> {
  const logger = createOperationLogger('getAllSalonChains', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('salon_chains_view')
    .select('*')
    .is('deleted_at', null)
    .order('name', { ascending: true })
    .returns<SalonChainRow[]>()

  if (error) throw error
  return data ?? []
}
