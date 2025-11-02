import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type StaffSchedule = Database['public']['Views']['staff_schedules_view']['Row']

export type StaffScheduleWithDetails = StaffSchedule & {
  staff_name?: string | null
  staff_title?: string | null
}

/**
 * Get all staff schedules for the salon
 */
export async function getStaffSchedules(): Promise<StaffScheduleWithDetails[]> {
  const logger = createOperationLogger('getStaffSchedules', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('scheduling').from('staff_schedules')
    .select('*')
    .eq('salon_id', salonId)
    .order('staff_id')
    .order('day_of_week')

  if (error) throw error

  if (!data) return []

  // Fetch staff details separately
  const staffMap = new Map<string, { full_name: string | null; title: string | null }>()

  const staffIds = [...new Set(data.map((s) => s.staff_id).filter(Boolean) as string[])]
  if (staffIds.length > 0) {
    const { data: staffData } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .select('id, title, user_id')
      .in('id', staffIds)

    if (staffData) {
      // Type guards for staff and profile data
      type StaffRow = { id: string; user_id: string | null; title: string | null }
      type ProfileRow = { profile_id: string; full_name: string | null }

      const isStaffRow = (item: unknown): item is StaffRow => {
        return item !== null && typeof item === 'object' && 'id' in item && 'user_id' in item
      }

      const validStaff = staffData.filter(isStaffRow)

      // Get profiles for all staff
      const userIds = validStaff.map((s) => s.user_id).filter((id): id is string => id !== null)
      if (userIds.length > 0) {
        const { data: profilesMetadata } = await supabase
          .schema('identity')
          .from('profiles_metadata')
          .select('profile_id, full_name')
          .in('profile_id', userIds)

        const profileMap = new Map<string, string | null>()
        if (profilesMetadata) {
          const validProfiles = profilesMetadata.filter((p): p is ProfileRow => {
            return p !== null && typeof p === 'object' && 'profile_id' in p
          })
          validProfiles.forEach((p) => {
            profileMap.set(p.profile_id, p.full_name)
          })
        }

        validStaff.forEach((staff) => {
          staffMap.set(staff.id, { full_name: staff.user_id ? profileMap.get(staff.user_id) || null : null, title: staff.title })
        })
      }
    }
  }

  return (data || []).map((schedule) => {
    const staff = schedule.staff_id ? staffMap.get(schedule.staff_id) : null
    return {
      ...schedule,
      staff_name: staff?.full_name || null,
      staff_title: staff?.title || null,
    }
  }) as StaffScheduleWithDetails[]
}

/**
 * Get schedules for a specific staff member
 */
export async function getStaffSchedulesByStaffId(
  staffId: string
): Promise<StaffScheduleWithDetails[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const { data, error } = await supabase
    .schema('scheduling').from('staff_schedules')
    .select('*')
    .eq('staff_id', staffId)
    .eq('salon_id', salonId)
    .order('day_of_week')

  if (error) throw error

  if (!data) return []

  // Fetch staff details
  const { data: staffData } = await supabase
    .schema('organization')
    .from('staff_profiles')
    .select('id, title, user_id')
    .eq('id', staffId)
    .single()

  let staff_name: string | null = null
  let staff_title: string | null = null

  if (staffData && staffData.user_id) {
    const { data: profileMetadata } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .select('profile_id, full_name')
      .eq('profile_id', staffData.user_id)
      .single()

    staff_name = profileMetadata?.full_name || null
    staff_title = staffData.title || null
  }

  return (data || []).map((schedule) => ({
    ...schedule,
    staff_name,
    staff_title,
  })) as StaffScheduleWithDetails[]
}

/**
 * Get all staff members for schedule management
 */
export async function getStaffForScheduling(): Promise<
  Array<{ id: string; full_name: string | null; title: string | null }>
> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('organization')
    .from('staff_profiles')
    .select('id, title, user_id')
    .eq('salon_id', salonId)

  if (error) throw error

  if (!data) return []

  // Get profiles for staff members
  const userIds = data.map((s) => s.user_id).filter(Boolean)
  if (userIds.length === 0) return []

  const { data: profilesMetadata } = await supabase
    .schema('identity')
    .from('profiles_metadata')
    .select('profile_id, full_name')
    .in('profile_id', userIds)
    .order('full_name')

  type ProfileRow = { profile_id: string; full_name: string | null }

  const profileMap = new Map<string, string | null>()
  if (profilesMetadata) {
    const validProfiles = profilesMetadata.filter((p): p is ProfileRow => {
      return p !== null && typeof p === 'object' && 'profile_id' in p
    })
    validProfiles.forEach((p) => {
      profileMap.set(p.profile_id, p.full_name)
    })
  }

  return data
    .map((staff) => ({
      id: staff.id,
      full_name: profileMap.get(staff.user_id) || null,
      title: staff.title,
    }))
    .sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''))
}
