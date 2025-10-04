import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type SalonDescription = Database['public']['Views']['salon_descriptions']['Row']

export async function getSalonDescription(salonId: string): Promise<SalonDescription | null> {
  // SECURITY: Require business user role
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Verify salon ownership
  const { data: salon } = await supabase
    .from('salons')
    .select('owner_id')
    .eq('id', salonId)
    .single<{ owner_id: string | null }>()

  if (!salon || salon.owner_id !== session.user.id) {
    throw new Error('Unauthorized: Not your salon')
  }

  const { data, error } = await supabase
    .from('salon_descriptions')
    .select('*')
    .eq('salon_id', salonId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // Ignore "not found" errors
  return data
}

export async function getUserSalonDescription(): Promise<SalonDescription | null> {
  // SECURITY: Require business user role
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Get user's salon
  const { data: salon } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .single<{ id: string }>()

  if (!salon) throw new Error('No salon found for user')

  return getSalonDescription(salon.id)
}
