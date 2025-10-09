import 'server-only';
import { requireAdminClient } from './admin-analytics-shared'
import type { AdminAppointmentRow } from './admin-analytics-types'

const APPOINTMENTS_TABLE = 'admin_appointments_overview'

export async function getAllAppointments(limit = 100): Promise<AdminAppointmentRow[]> {
  const supabase = await requireAdminClient()
  const { data, error } = await supabase
    .from(APPOINTMENTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}
