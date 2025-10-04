import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type Service = Database['public']['Views']['services']['Row']
type Salon = Database['public']['Views']['salons']['Row']

/**
 * Get user's salon
 * IMPROVED: Uses centralized requireUserSalonId() helper
 */
export async function getUserSalon(): Promise<Salon> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon ID (throws if not found)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .single()

  if (error) throw error
  return data as Salon
}

export async function getServices(salonId: string) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .order('name')

  if (error) throw error
  return data as Service[]
}
