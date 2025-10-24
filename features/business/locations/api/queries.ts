import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { SalonLocation } from '@/features/business/locations'

/**
 * Get all locations for the user's salon
 * IMPROVED: Uses centralized requireUserSalonId() helper
 */
export async function getSalonLocations(): Promise<SalonLocation[]> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon ID (throws if not found)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_locations')
    .select('*')
    .eq('salon_id', salonId)
    .is('deleted_at', null)
    .order('is_primary', { ascending: false })
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * Get single salon location by ID
 * IMPROVED: Uses centralized requireUserSalonId() helper
 */
export async function getSalonLocationById(
  id: string
): Promise<SalonLocation | null> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon ID (throws if not found)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_locations')
    .select('*')
    .eq('id', id)
    .eq('salon_id', salonId)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) throw error
  return data
}