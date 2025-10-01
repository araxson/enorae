import { createClient } from '@/lib/supabase/client'
import type { Service } from '../types/service.types'

export async function getSalonServices(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .is('deleted_at', null)
    .order('name')

  if (error) throw error
  return data as Service[]
}

export async function getActiveServices(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name')

  if (error) throw error
  return data as Service[]
}