import 'server-only'

import { requireAnyRole, requireUserSalonId, requireAuth, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type SalonView = Database['public']['Views']['salons_view']['Row']

export async function getUserSalon(): Promise<SalonView> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons_view')
    .select('*')
    .eq('id', salonId)
    .single()

  if (error) throw error
  return data
}

export async function getUserSalonIds(): Promise<string[]> {
  try {
    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    const supabase = await createClient()
    const session = await requireAuth()

    const { data: tenantData, error: tenantError } = await supabase
      .schema('organization')
      .from('salon_chains')
      .select('id, deleted_at')
      .eq('owner_id', session.user.id)
      .maybeSingle()

    if (tenantError) {
      console.error('[getUserSalonIds] Tenant query error:', tenantError)
    }

    const chain = tenantData && tenantData.deleted_at === null
      ? { id: tenantData.id as string }
      : null

    if (chain) {
      const { data: chainSalons, error: chainError } = await supabase
        .from('salons_view')
        .select('id')
        .eq('chain_id', chain.id)
        .is('deleted_at', null)

      if (chainError) {
        console.error('[getUserSalonIds] Chain salons query error:', chainError)
        return []
      }

      const salons = (chainSalons || []) as Array<{ id: string }>
      return salons.map((salon) => salon.id)
    }

    const salonId = await requireUserSalonId()
    return [salonId]
  } catch (error) {
    console.error('[getUserSalonIds] Unexpected error:', error)
    return []
  }
}
