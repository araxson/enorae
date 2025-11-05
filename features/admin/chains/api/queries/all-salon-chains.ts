import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { SalonChainRow } from '../../api/types'
import { createOperationLogger } from '@/lib/observability'

export async function getAllSalonChains(): Promise<SalonChainRow[]> {
  const logger = createOperationLogger('getAllSalonChains', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('salon_chains_view')
    .select('id, name, description, owner_id, total_salons, is_active, created_at, updated_at')
    .is('deleted_at', null)
    .order('name', { ascending: true })
    .returns<SalonChainRow[]>()

  if (error) throw error
  return data ?? []
}
