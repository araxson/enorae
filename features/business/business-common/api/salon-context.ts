import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

/**
 * UUID validation regex
 * Exported for reuse across business features
 */
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const STAFF_TABLE = 'staff_profiles_view'
const STAFF_SALON_FIELD = 'salon_id'

/**
 * Resolve salon context for the current business user
 *
 * Verifies user has business role and retrieves their salon ID.
 * Used across business features for salon-scoped operations.
 *
 * @returns Object containing supabase client, session, and salonId
 * @throws Error if user is unauthorized or has no salon
 */
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
