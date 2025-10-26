'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Salon, Staff } from '@/features/business/staff-services/types'

export async function getAuthorizedContext(staffId: string) {
  const supabase = await createClient()
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_id', session.user['id'])
    .single()

  if (!salon) {
    return { error: 'Salon not found' as const }
  }

  const typedSalon = salon as Salon
  if (!typedSalon['id']) {
    return { error: 'Invalid salon' as const }
  }

  const { data: staff } = await supabase
    .from('staff_profiles_view')
    .select('*')
    .eq('id', staffId)
    .single()

  if (!staff || (staff as Staff)['salon_id'] !== typedSalon['id']) {
    return { error: 'Unauthorized' as const }
  }

  return { supabase, session, salon: typedSalon, staff: staff as Staff }
}
