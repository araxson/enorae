import 'server-only'

import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type StaffRow = Database['public']['Views']['staff_profiles_view']['Row']

export interface AuthorizedContext {
  supabase: Awaited<ReturnType<typeof createClient>>
  staff: StaffRow
}

export async function authorizeStaffAccess(
  staffId: string,
): Promise<AuthorizedContext> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data: staffProfile, error } = await supabase
    .from('staff_profiles_view')
    .select('id, user_id, salon_id, staff_role, title, experience_years, is_active, created_at')
    .eq('user_id', session.user.id)
    .eq('id', staffId)
    .maybeSingle()

  if (error) throw error
  if (!staffProfile) {
    throw new Error('Unauthorized')
  }

  return { supabase, staff: staffProfile }
}

export function toDateOnly(value: string | Date | null | undefined) {
  if (!value) return null
  if (value instanceof Date) {
    return value.toISOString().split('T')[0]
  }
  return new Date(value).toISOString().split('T')[0]
}

export function calculateDefaultCommission(amount: number, rate = 0.4) {
  return amount * rate
}
