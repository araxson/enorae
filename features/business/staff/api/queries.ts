import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { getUserSalon } from '@/features/business/business-common/api/queries'
import { mergeStaffWithUsers, type EnrichedStaffProfile } from '@/features/shared/staff/api/enrich'

type StaffProfileRow = Database['public']['Views']['staff_profiles_view']['Row']
type UserOverviewRow = Database['public']['Views']['admin_users_overview_view']['Row']

// Re-export getUserSalon from shared location
export { getUserSalon }

async function fetchStaffUsers(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userIds: string[],
) {
  if (userIds.length === 0) {
    return []
  }

  const { data, error } = await supabase
    .from('admin_users_overview_view')
    .select('*')
    .in('id', userIds)
    .returns<UserOverviewRow[]>()

  if (error) throw error
  return data ?? []
}

export async function getStaff(salonId: string): Promise<EnrichedStaffProfile[]> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: You do not have access to this salon')
  }

  const supabase = await createClient()

  // Explicit salon filter for security
  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: true })
    .returns<StaffProfileRow[]>()

  if (error) throw error

  const staffRows = data ?? []
  const userIds = staffRows
    .map((staff) => staff.user_id)
    .filter((id): id is string => typeof id === 'string')

  const users = await fetchStaffUsers(supabase, userIds)

  return mergeStaffWithUsers(staffRows, users)
}

/**
 * Get a single staff member by ID (with salon ownership verification)
 * IMPROVED: Uses centralized requireUserSalonId() helper
 */
export async function getStaffById(staffId: string): Promise<EnrichedStaffProfile | null> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  // Get user's salon ID (throws if not found)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get staff member, verify they belong to the same salon
  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('*')
    .eq('id', staffId)
    .eq('salon_id', salonId)
    .maybeSingle<StaffProfileRow>()

  if (error) throw error
  if (!data) return null

  const users = await fetchStaffUsers(
    supabase,
    data.user_id ? [data.user_id] : [],
  )

  const [enriched] = mergeStaffWithUsers([data], users)
  return enriched ?? null
}

export {
  getStaffWithServices,
  getAvailableServices,
  getStaffServices,
  type StaffWithServices,
} from './internal/staff-services'
