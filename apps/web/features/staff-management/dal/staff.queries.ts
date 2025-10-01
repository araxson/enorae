import { createClient } from '@/lib/supabase/client'
import type { Staff } from '../types/staff.types'

export async function getStaffMembers(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('salon_id', salonId)
    .is('deleted_at', null)
    .order('title')

  if (error) throw error
  return data as Staff[]
}

export async function getStaffMember(staffId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('id', staffId)
    .single()

  if (error) throw error
  return data as Staff
}