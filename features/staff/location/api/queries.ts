import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { StaffLocationDetail } from '@/features/staff/location/api/types'

export async function getMyLocation(): Promise<StaffLocationDetail | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get user's salon_id
  const { data: staffData, error: staffError } = await supabase
    .from('staff_profiles_view')
    .select('salon_id, location_id')
    .eq('user_id', user.id)
    .single<{ salon_id: string; location_id: string | null }>()

  if (staffError || !staffData?.salon_id) throw new Error('Staff record not found')

  // If staff has a specific location, get that one
  if (staffData.location_id) {
    const { data, error } = await supabase
      .from('salon_locations_view')
      .select('*')
      .eq('id', staffData.location_id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }

  // Otherwise get the primary location for the salon
  const { data, error } = await supabase
    .from('salon_locations_view')
    .select('*')
    .eq('salon_id', staffData.salon_id)
    .eq('is_primary', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as StaffLocationDetail
}

export async function getAllSalonLocations(): Promise<StaffLocationDetail[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get user's salon_id
  const { data: staffData, error: staffError } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('user_id', user.id)
    .single<{ salon_id: string }>()

  if (staffError || !staffData?.salon_id) throw new Error('Staff record not found')

  const { data, error } = await supabase
    .from('salon_locations_view')
    .select('*')
    .eq('salon_id', staffData.salon_id)
    .order('is_primary', { ascending: false })

  if (error) throw error
  return (data as StaffLocationDetail[]) || []
}
