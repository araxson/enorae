import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Note: salon_locations doesn't have public view yet

type SalonLocation = Database['public']['Views']['salon_locations']['Row']

/**
 * Get all locations for the user's salon
 */
export async function getSalonLocations(): Promise<SalonLocation[]> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('salon_locations')
    .select('*')
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .order('is_primary', { ascending: false })
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * Get single salon location by ID
 */
export async function getSalonLocationById(
  id: string
): Promise<SalonLocation | null> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  if (!staffProfile?.salon_id) throw new Error('User salon not found')

  const { data, error } = await supabase
    .from('salon_locations')
    .select('*')
    .eq('id', id)
    .eq('salon_id', staffProfile.salon_id)
    .is('deleted_at', null)
    .single()

  if (error) throw error
  return data
}
