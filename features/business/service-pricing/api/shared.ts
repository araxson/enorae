import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const STAFF_TABLE = 'staff'
const STAFF_SALON_FIELD = 'salon_id'

export async function resolveSalonContext() {
  const supabase = await createClient()
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!session.user) {
    throw new Error('Unauthorized')
  }

  const { data: staffProfile } = await supabase
    .from(STAFF_TABLE)
    .select(STAFF_SALON_FIELD)
    .eq('user_id', session.user.id)
    .single<{ salon_id: string | null }>()

  if (!staffProfile?.salon_id) {
    throw new Error('User salon not found')
  }

  return { supabase, session, salonId: staffProfile.salon_id }
}
