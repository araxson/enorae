import { createClient } from '@/lib/supabase/server'
import {
  requireAnyRole,
  getSalonContext,
  ROLE_GROUPS,
} from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { setActiveSalon } from '../api/mutations'
import { BusinessSalonSwitcherClient } from './salon-switcher-client'

type SalonOption = Pick<Database['public']['Views']['salons_view']['Row'], 'id' | 'name'>

export async function BusinessSalonSwitcher() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const { activeSalonId, accessibleSalonIds } = await getSalonContext()
  if (!accessibleSalonIds.length || accessibleSalonIds.length === 1) {
    return null
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('salons_view')
    .select('id, name')
    .in('id', accessibleSalonIds)
    .order('name', { ascending: true })
    .returns<SalonOption[]>()

  const salons = data ?? []

  if (salons.length === 0) {
    return null
  }

  return (
    <BusinessSalonSwitcherClient
      salons={salons}
      activeSalonId={activeSalonId ?? accessibleSalonIds[0] ?? ''}
      setActiveSalon={setActiveSalon}
    />
  )
}
