import 'server-only'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// COMPLIANCE: Use public View type for reads
type SalonSettings = Database['public']['Views']['salon_settings']['Row']

export async function getSalonSettings(salonId: string): Promise<SalonSettings | null> {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_settings')
    .select('*')
    .eq('salon_id', salonId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // Ignore "not found" errors
  return data
}

export async function getUserSalonSettings(): Promise<SalonSettings | null> {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  return getSalonSettings(salonId)
}
