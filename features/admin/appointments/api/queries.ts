import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type AdminAppointment = Database['public']['Views']['admin_appointments_overview']['Row']

/**
 * Get all appointments overview
 * SECURITY: Platform admin only
 */
export async function getAllAppointments(limit = 100): Promise<AdminAppointment[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_appointments_overview')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}
