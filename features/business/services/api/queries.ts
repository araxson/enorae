import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { getUserSalon } from '@/features/business/business-common/api/queries'

type Service = Database['public']['Views']['services']['Row']

// Re-export getUserSalon from shared location
export { getUserSalon }

export async function getCurrentSalonServices() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salon = await getUserSalon()
  return getServices(salon.id!)
}

export async function getServices(salonId: string) {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .order('name')

  if (error) throw error
  return data as Service[]
}