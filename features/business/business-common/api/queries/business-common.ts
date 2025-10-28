import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId as authRequireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons_view']['Row']
type StaffProfile = Database['public']['Views']['staff_profiles_view']['Row']

/**
 * Get user's salon (using centralized auth helper)
 * IMPROVED: Uses requireUserSalonId() from @/lib/auth for consistency
 *
 * This is the canonical getUserSalon implementation.
 * All other features should import from here.
 */
export async function getUserSalon(): Promise<Salon> {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon ID (throws if not found)
  const salonId = await authRequireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons_view')
    .select('*')
    .eq('id', salonId)
    .returns<Salon>()
    .single()

  if (error) throw error
  return data
}

/**
 * Get the salon ID for the current user (either as owner or staff)
 * @deprecated Use requireUserSalonId() from @/lib/auth instead
 * @returns The salon ID or null if not found
 */
export async function getUserSalonId(userId: string): Promise<string | null> {
  const supabase = await createClient()

  // First check if user owns a salon
  const { data: ownedSalon, error: ownedSalonError } = await supabase
    .from('salons_view')
    .select('id')
    .eq('owner_id', userId)
    .returns<Pick<Salon, 'id'>[]>()
    .maybeSingle()

  if (ownedSalonError) throw ownedSalonError

  if (ownedSalon?.id) {
    return ownedSalon.id
  }

  // If not an owner, check if they're staff
  const { data: staffProfile, error: staffProfileError } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', userId)
    .returns<Pick<StaffProfile, 'salon_id'>[]>()
    .maybeSingle()

  if (staffProfileError) throw staffProfileError

  return staffProfile?.salon_id || null
}

/**
 * Get all salon IDs for a user (owner or staff in multiple salons)
 * @returns Array of salon IDs
 */
export async function getUserSalonIds(userId: string): Promise<string[]> {
  const supabase = await createClient()
  const salonIds: string[] = []

  // Get owned salons
  const { data: ownedSalons, error: ownedSalonsError } = await supabase
    .from('salons_view')
    .select('id')
    .eq('owner_id', userId)
    .returns<Pick<Salon, 'id'>[]>()

  if (ownedSalonsError) throw ownedSalonsError

  salonIds.push(...(ownedSalons ?? []).map(s => s.id).filter((id): id is string => id !== null))

  // Get salons where user is staff
  const { data: staffProfiles, error: staffProfilesError } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', userId)
    .returns<Pick<StaffProfile, 'salon_id'>[]>()

  if (staffProfilesError) throw staffProfilesError

  const staffSalonIds = (staffProfiles ?? [])
    .map(sp => sp.salon_id)
    .filter((id): id is string => id !== null)
  salonIds.push(...staffSalonIds)

  // Return unique salon IDs
  return [...new Set(salonIds)]
}
