'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, getUserSalonIds, ROLE_GROUPS } from '@/lib/auth'

import { UUID_REGEX } from './constants'

export async function getAuthorizedContext(salonId: string) {
  if (!UUID_REGEX.test(salonId)) {
    return { error: 'Invalid salon ID format' as const }
  }

  const supabase = await createClient()
  const session = await requireAnyRole([
    ...ROLE_GROUPS.BUSINESS_USERS,
    ...ROLE_GROUPS.STAFF_USERS,
  ])

  const accessibleSalonIds = await getUserSalonIds()
  if (!accessibleSalonIds.includes(salonId)) {
    return { error: 'Unauthorized: Not your salon' as const }
  }

  return { supabase, session }
}
