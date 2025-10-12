import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import type { SalonChainRow } from './types'

export async function getChainById(chainId: string): Promise<SalonChainRow | null> {
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
