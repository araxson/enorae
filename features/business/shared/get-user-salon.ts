import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']

/**
 * Get the salon ID for the current user (either as owner or staff)
 * @returns The salon ID or null if not found
 */
export async function getUserSalonId(userId: string): Promise<string | null> {
  const supabase = await createClient()

  // First check if user owns a salon
  const { data: ownedSalon, error: ownedSalonError } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', userId)
    .maybeSingle()

  if (ownedSalonError) throw ownedSalonError

  const salon = ownedSalon as { id: string } | null

  if (salon?.id) {
    return salon.id
  }

  // If not an owner, check if they're staff
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', userId)
    .maybeSingle<{ salon_id: string | null }>()

  return staffProfile?.salon_id || null
}

/**
 * Get the full salon object for the current user (either as owner or staff)
 * @returns The salon object or null if not found
 */
export async function getUserSalon(userId: string): Promise<Salon | null> {
  const salonId = await getUserSalonId(userId)

  if (!salonId) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .maybeSingle()

  if (error) throw error
  return data as Salon | null
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
    .from('salons')
    .select('id')
    .eq('owner_id', userId)

  if (ownedSalonsError) throw ownedSalonsError

  const salons = (ownedSalons || []) as Array<{ id: string }>
  salonIds.push(...salons.map(s => s.id))

  // Get salons where user is staff
  const { data: staffProfiles, error: staffProfilesError } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', userId)

  if (staffProfilesError) throw staffProfilesError

  const profiles = (staffProfiles || []) as Array<{ salon_id: string | null }>
  const staffSalonIds = profiles
    .map(sp => sp.salon_id)
    .filter((id): id is string => id !== null)
  salonIds.push(...staffSalonIds)

  // Return unique salon IDs
  return [...new Set(salonIds)]
}