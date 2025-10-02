import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services']['Row']
type Salon = Database['public']['Views']['salons']['Row']

export async function getUserSalon() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (error) throw error
  return data as Salon
}

export async function getServices(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .order('name')

  if (error) throw error
  return data as Service[]
}
