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
  const { data: ownedSalon } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', userId)
    .maybeSingle()

  if (ownedSalon?.id) {
    return ownedSalon.id
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
  const { data: ownedSalons } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', userId)

  if (ownedSalons) {
    salonIds.push(...ownedSalons.map(s => s.id))
  }

  // Get salons where user is staff
  const { data: staffProfiles } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', userId)

  if (staffProfiles) {
    const staffSalonIds = staffProfiles
      .map(sp => sp.salon_id)
      .filter((id): id is string => id !== null)
    salonIds.push(...staffSalonIds)
  }

  // Return unique salon IDs
  return [...new Set(salonIds)]
}