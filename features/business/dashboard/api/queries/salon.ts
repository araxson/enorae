import 'server-only'

import { requireAnyRole, requireUserSalonId, requireAuth, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type SalonView = Database['public']['Views']['salons_view']['Row']
type SalonRecord = Database['organization']['Tables']['salons']['Row']

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
        .schema('organization')
        .from('salons')
        .select('id')
        .eq('chain_id', chain.id)
        .eq('owner_id', session.user.id)
        .is('deleted_at', null)
        .returns<Pick<SalonRecord, 'id'>[]>()

      if (chainError) {
        console.error('[getUserSalonIds] Chain salons query error:', chainError)
        return []
      }

      const salonIds = (chainSalons || [])
        .map((salon) => salon.id)
        .filter((id): id is string => Boolean(id))

      return salonIds
    }

    const salonId = await requireUserSalonId()
    return [salonId]
  } catch (error) {
    console.error('[getUserSalonIds] Unexpected error:', error)
    return []
  }
}
