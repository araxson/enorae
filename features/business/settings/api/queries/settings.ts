import 'server-only'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

// COMPLIANCE: Use public View type for reads
type SalonSettings = Database['public']['Views']['salon_settings_view']['Row']

export async function getSalonSettings(salonId: string): Promise<SalonSettings | null> {
  const logger = createOperationLogger('getSalonSettings', {})
  logger.start()

  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_settings_view')
    .select('salon_id, booking_buffer_minutes, cancellation_window_hours, max_advance_booking_days, require_deposit, deposit_amount, deposit_percentage, allow_walkins, booking_status, created_at, updated_at')
    .eq('salon_id', salonId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // Ignore "not found" errors
  return data as unknown as SalonSettings | null
}

export async function getUserSalonSettings(): Promise<SalonSettings | null> {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  return getSalonSettings(salonId)
}