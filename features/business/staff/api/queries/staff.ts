import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { getUserSalon } from '@/features/business/common/api/queries'
import { mergeStaffWithUsers, type EnrichedStaffProfile } from '@/features/shared/staff/api/enrich'
import { createOperationLogger } from '@/lib/observability'

type StaffProfileRow = Database['public']['Views']['staff_profiles_view']['Row']
type UserOverviewRow = Database['public']['Views']['admin_users_overview_view']['Row']
type StaffServiceRow = Database['public']['Views']['staff_services_view']['Row']

// Re-export types
export { getUserSalon }
export type { EnrichedStaffProfile }

// Type for staff with their associated services
export type StaffWithServices = EnrichedStaffProfile & {
  services: StaffServiceRow[]
}

async function fetchStaffUsers(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userIds: string[],
) {
  if (userIds.length === 0) {
    return []
  }

  const { data, error } = await supabase
    .from('admin_users_overview_view')
    .select('id, email, full_name, avatar_url, phone_number, created_at, updated_at')
    .in('id', userIds)
    .returns<UserOverviewRow[]>()

  if (error) throw error
  return data ?? []
}

export async function getStaff(salonId: string): Promise<EnrichedStaffProfile[]> {
  const logger = createOperationLogger('getStaff', {})
  logger.start()

  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: You do not have access to this salon')
  }

  const supabase = await createClient()

  // Explicit salon filter for security
  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('id, user_id, salon_id, title, bio, hourly_rate, commission_rate, is_active, created_at, updated_at')
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
    .select('id, user_id, salon_id, title, bio, hourly_rate, commission_rate, is_active, created_at, updated_at')
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

export async function getStaffWithServices(salonId: string) {
  const supabase = await createClient()

  // Get all staff for the salon
  const staff = await getStaff(salonId)

  // Get all staff services for the salon
  const { data: staffServices, error } = await supabase
    .from('staff_services_view')
    .select('id, staff_id, service_id, salon_id, custom_price, custom_duration_minutes, created_at, updated_at')
    .eq('salon_id', salonId)
    .returns<StaffServiceRow[]>()

  if (error) throw error

  // Group services by staff_id
  const servicesByStaffId = new Map<string, StaffServiceRow[]>()
  staffServices?.forEach(service => {
    const staffId = service.staff_id
    if (staffId) {
      if (!servicesByStaffId.has(staffId)) {
        servicesByStaffId.set(staffId, [])
      }
      servicesByStaffId.get(staffId)?.push(service)
    }
  })

  // Merge staff with their services
  return staff.map(staffMember => {
    const staffId = staffMember.id ?? null
    return {
      ...staffMember,
      services: staffId ? servicesByStaffId.get(staffId) ?? [] : [],
    }
  })
}

export async function getAvailableServices(salonId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services_view')
    .select('id, salon_id, name, description, slug, category_name, price, duration_minutes, is_active, created_at, updated_at')
    .eq('salon_id', salonId)

  if (error) throw error
  return data ?? []
}
