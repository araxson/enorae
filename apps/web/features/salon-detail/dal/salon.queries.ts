import { createClient } from '@/lib/supabase/client'
import type { Database } from '@enorae/database/types'

type Salon = Database['public']['Views']['salons']['Row']
type Service = Database['public']['Views']['services']['Row']
type Staff = Database['public']['Views']['staff']['Row']

export async function getSalonBySlug(slug: string) {
  const supabase = await createClient()

  const { data: salon, error } = await supabase
    .from('salons')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return salon as Salon
}

export async function getSalonServices(salonId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data as Service[]
}

export async function getSalonStaff(salonId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('salon_id', salonId)
    .is('deleted_at', null)
    .order('title')

  if (error) throw error
  return data as Staff[]
}