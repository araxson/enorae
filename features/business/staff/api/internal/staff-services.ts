import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import {
  mergeStaffWithUsers,
  type EnrichedStaffProfile,
} from '@/features/shared/staff/api/enrich'

type StaffService = Database['public']['Views']['staff_services']['Row']
type Service = Database['public']['Views']['services_view']['Row']
type StaffProfileRow = Database['public']['Views']['staff_profiles_view']['Row']
type UserOverviewRow = Database['public']['Views']['admin_users_overview_view']['Row']
type Salon = Database['public']['Views']['salons_view']['Row']

export type StaffWithServices = EnrichedStaffProfile & {
  services: StaffService[]
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
    .select('*')
    .in('id', userIds)
    .returns<UserOverviewRow[]>()

  if (error) throw error
  return data ?? []
}

/**
 * Get all staff members with their assigned services
 */
export async function getStaffWithServices(salonId: string): Promise<StaffWithServices[]> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Get all staff for salon
  const { data: staffRows, error: staffError } = await supabase
    .from('staff_profiles_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: true })
    .returns<StaffProfileRow[]>()

  if (staffError) throw staffError

  const staff = staffRows ?? []
  const userIds = staff
    .map((row) => row.user_id)
    .filter((id): id is string => typeof id === 'string')

  const users = await fetchStaffUsers(supabase, userIds)

  const enrichedStaff = mergeStaffWithUsers(staff, users)

  // Get all staff services for this salon
  const staffIds =
    enrichedStaff.map((s) => s.id).filter((id): id is string => Boolean(id)) || []

  if (staffIds.length === 0) {
    return []
  }

  const { data: staffServices, error: servicesError } = await supabase
    .from('staff_services')
    .select('*')
    .in('staff_id', staffIds)

  if (servicesError) throw servicesError

  // Group services by staff
  const staffWithServices: StaffWithServices[] = enrichedStaff
    .filter((member): member is EnrichedStaffProfile & { id: string } => Boolean(member.id))
    .map((member) => {
      const staffMember = member as EnrichedStaffProfile & { id: string }
      return {
        ...staffMember,
        services: (staffServices || []).filter(
          (service) => (service as StaffService)['staff_id'] === staffMember.id
        ),
      }
    })

  return staffWithServices
}

/**
 * Get available services for a salon (for assignment)
 */
export async function getAvailableServices(salonId: string): Promise<Service[]> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name')

  if (error) throw error
  return data as Service[]
}

/**
 * Get services assigned to a specific staff member
 */
export async function getStaffServices(staffId: string): Promise<StaffService[]> {
  // SECURITY: Require business role
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Verify staff belongs to user's salon
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_id', session.user['id'])
    .single()

  if (!salon) throw new Error('Salon not found')

  const { data: staffRow } = await supabase
    .from('staff_profiles_view')
    .select('*')
    .eq('id', staffId)
    .maybeSingle<StaffProfileRow>()

  if (!staffRow || staffRow['salon_id'] !== (salon as Salon)['id']) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('staff_services')
    .select('*')
    .eq('staff_id', staffId)
    .order('service_name', { ascending: true })

  if (error) throw error
  return data || []
}
