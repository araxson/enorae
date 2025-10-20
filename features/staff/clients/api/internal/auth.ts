import 'server-only'
import { requireAuth } from '@/lib/auth'
import type { Session } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

type StaffProfile = {
  id: string
  salon_id: string | null
}

/**
 * Verifies staff ownership and returns staff profile
 * Throws if user is not authorized
 */
export async function verifyStaffOwnership(staffId?: string): Promise<{
  session: Session
  supabase: SupabaseClient<Database>
  staffProfile: StaffProfile
}> {
  const session = await requireAuth()
  const supabase = await createClient()

  let query = supabase
    .from('staff')
    .select('id, salon_id')
    .eq('user_id', session.user.id)
    .limit(1)

  if (staffId) {
    query = query.eq('id', staffId)
  }

  const { data: staffProfile, error } = await query.maybeSingle<StaffProfile>()

  if (error) throw error

  if (!staffProfile) throw new Error('Unauthorized')

  return { session, supabase, staffProfile }
}
