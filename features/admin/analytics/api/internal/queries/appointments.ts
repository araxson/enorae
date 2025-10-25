import 'server-only';
import { requireAdminClient } from '@/features/admin/analytics/api/admin-analytics-shared'
import type { AdminAppointmentRow } from '@/features/admin/analytics/api/admin-analytics-types'

const APPOINTMENTS_TABLE = 'admin_appointments_overview_view'

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
