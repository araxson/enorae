import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services']['Row']
type Staff = Database['public']['Views']['staff']['Row']
type Salon = Database['public']['Views']['salons']['Row']

export async function getSalonById(salonId: string) {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .eq('is_active', true)
    .single()

  if (error) throw error
  return data as Salon
}

export async function getSalonMetadata(salonId: string) {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('name, short_description')
    .eq('id', salonId)
    .single()

  if (error) return null
  return data as { name: string | null; short_description: string | null } | null
}

export async function getAvailableServices(salonId: string) {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .eq('is_bookable', true)
    .order('name')

  if (error) throw error
  return data as Service[]
}

export async function getAvailableStaff(salonId: string) {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('salon_id', salonId)
    .order('title')

  if (error) throw error
  return data as Staff[]
}