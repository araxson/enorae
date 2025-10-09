import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { getUserSalon } from '../../shared/api/salon.queries'

type Staff = Database['public']['Views']['staff']['Row']

// Re-export getUserSalon from shared location
export { getUserSalon }

export async function getStaff(salonId: string) {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: You do not have access to this salon')
  }

  const supabase = await createClient()

  // Explicit salon filter for security
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('salon_id', salonId)
    .order('full_name')

  if (error) throw error
  return data as Staff[]
}

/**
 * Get a single staff member by ID (with salon ownership verification)
 * IMPROVED: Uses centralized requireUserSalonId() helper
 */
export async function getStaffById(staffId: string): Promise<Staff | null> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon ID (throws if not found)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get staff member, verify they belong to the same salon
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('id', staffId)
    .eq('salon_id', salonId)
    .maybeSingle()

  if (error) throw error
  return data
}
