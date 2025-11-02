import 'server-only'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type SalonContactDetails = Database['public']['Views']['salon_contact_details_view']['Row']

export async function getSalonContactDetails(salonId: string): Promise<SalonContactDetails | null> {
  const logger = createOperationLogger('getSalonContactDetails', {})
  logger.start()

  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_contact_details_view')
    .select('*')
    .eq('salon_id', salonId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // Ignore "not found" errors
  return data
}

export async function getUserSalonContactDetails(): Promise<SalonContactDetails | null> {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  return getSalonContactDetails(salonId)
}