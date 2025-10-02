import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']
type Service = Database['public']['Views']['services']['Row']
type Staff = Database['public']['Views']['staff']['Row']

export async function getSalonBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) throw error
  return data as Salon
}

export async function getSalonMetadataBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('name, description, location_address')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as { name: string | null; description: string | null; location_address: string | null } | null
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
    .eq('status', 'active')
    .order('full_name')

  if (error) throw error
  return data as Staff[]
}
