import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'

const SCHEDULING_SCHEMA = 'scheduling'
const SCHEDULES_PATH = '/business/staff/schedules'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export async function resolveContext() {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  return { supabase, session, salonId }
}

export async function ensureStaffAccess(
  supabase: Awaited<ReturnType<typeof createClient>>,
  staffId: string,
  salonId: string,
) {
  const { data: staff } = await supabase
    .from('staff_profiles_view')
    .select('salon_id')
    .eq('id', staffId)
    .single<{ salon_id: string | null }>()

  if (!staff || staff.salon_id !== salonId) {
    throw new Error('Staff member not found or access denied')
  }
}

export function revalidateSchedules() {
  revalidatePath(SCHEDULES_PATH)
}

export function schedulingTable(table: string) {
  return `${SCHEDULING_SCHEMA}.${table}`
}
