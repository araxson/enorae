import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { verifySession } from '@/lib/auth/session'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'
import {
  mergeStaffWithUsers,
  type EnrichedStaffProfile,
} from '@/features/shared/staff/api/enrich'

type StaffProfileRow = Database['public']['Views']['staff_profiles_view']['Row']
type UserOverviewRow = Database['public']['Views']['admin_users_overview_view']['Row']
type Service = Database['public']['Views']['services_view']['Row']

export type StaffProfile = EnrichedStaffProfile & {
  services?: Service[]
  // NOTE: These fields should be added to the staff view when implementing ratings feature
  average_rating?: number | null
  review_count?: number | null
  specialties?: string[] | null
  certifications?: string[] | null
}

/**
 * Get staff member profile by ID
 */
export async function getStaffProfile(staffId: string): Promise<StaffProfile | null> {
  const logger = createOperationLogger('getStaffProfile', {})
  logger.start()

  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data: staff, error: staffError } = await supabase
    .from('staff_profiles_view')
    .select('*')
    .eq('id', staffId)
    .maybeSingle<StaffProfileRow>()

  if (staffError) {
    if (staffError.code === 'PGRST116') return null
    throw staffError
  }

  if (!staff) return null

  const userIds = staff.user_id ? [staff.user_id] : []

  const { data: users, error: userError } = await supabase
    .from('admin_users_overview_view')
    .select('*')
    .in('id', userIds)
    .returns<UserOverviewRow[]>()

  if (userError) throw userError

  const [enrichedStaff] = mergeStaffWithUsers([staff], users ?? [])

  // Get services offered by this staff member via staff_services junction table
  const { data: staffServices, error: servicesError } = await supabase
    .from('staff_services_view')
    .select('service_id')
    .eq('staff_id', staffId)
    .eq('is_available', true)

  if (servicesError) throw servicesError

  const serviceIds = (staffServices || [])
    .map((row) => row['service_id'])
    .filter((id) => typeof id === 'string')

  let services: Service[] = []

  if (serviceIds.length > 0) {
    const { data: servicesData, error: servicesFetchError } = await supabase
      .from('services_view')
      .select('*')
      .in('id', serviceIds)
      .eq('is_active', true)

    if (servicesFetchError) throw servicesFetchError
    services = (servicesData || []) as Service[]
  }

  return {
    ...(enrichedStaff ?? staff),
    services,
  } as StaffProfile
}

/**
 * Get all active staff members for a salon
 */
export async function getSalonStaff(salonId: string): Promise<EnrichedStaffProfile[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: true })
    .returns<StaffProfileRow[]>()

  if (error) throw error

  const staff = data ?? []
  const userIds = staff
    .map((row) => row.user_id)
    .filter((id): id is string => typeof id === 'string')

  const { data: users, error: userError } = await supabase
    .from('admin_users_overview_view')
    .select('*')
    .in('id', userIds)
    .returns<UserOverviewRow[]>()

  if (userError) throw userError

  return mergeStaffWithUsers(staff, users ?? [])
}
