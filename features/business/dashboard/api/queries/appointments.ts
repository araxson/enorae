import 'server-only'

import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type AppointmentWithDetails = Database['public']['Views']['appointments_view']['Row']

export async function getRecentAppointments(
  salonId: string,
  limit: number = 5
): Promise<AppointmentWithDetails[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized salon access')
  }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('appointments_view')
      .select('*')
      .eq('salon_id', salonId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[getRecentAppointments] Query error:', error)
      return []
    }

    return (data || []) as AppointmentWithDetails[]
  } catch (error) {
    console.error('[getRecentAppointments] Unexpected error:', error)
    return []
  }
}
