import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// DATABASE PATTERN NOTE: Currently reading from schema table scheduling.blocked_times
// TODO: Create view view_blocked_times_with_relations in scheduling schema for proper read pattern
// View should include: blocked_time fields + staff info + salon info
// Once view is created, update all queries to use: .from('view_blocked_times_with_relations')

type BlockedTime = Database['scheduling']['Tables']['blocked_times']['Row']

export type BlockedTimeWithRelations = BlockedTime & {
  staff: { id: string; full_name: string | null } | null
  salon: { id: string; name: string } | null
}

/**
 * Get all blocked times for a specific salon
 */
export async function getBlockedTimesBySalon(salonId: string): Promise<BlockedTime[]> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  // Explicit salon filter for security
  const { data, error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .select('id, salon_id, staff_id, start_time, end_time, reason, recurring_rule, created_by_id, created_at')
    .eq('salon_id', salonId)
    .order('start_time', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get all blocked times for a specific staff member
 */
export async function getBlockedTimesByStaff(staffId: string): Promise<BlockedTime[]> {
  // SECURITY: Require staff or business role
  await requireAnyRole([...ROLE_GROUPS.STAFF_USERS, ...ROLE_GROUPS.BUSINESS_USERS])

  const supabase = await createClient()

  // Explicit staff filter for security
  const { data, error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .select('id, salon_id, staff_id, start_time, end_time, reason, recurring_rule, created_by_id, created_at')
    .eq('staff_id', staffId)
    .order('start_time', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get upcoming blocked times for a salon
 */
export async function getUpcomingBlockedTimes(salonId: string): Promise<BlockedTime[]> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const now = new Date().toISOString()

  // Explicit salon filter for security
  const { data, error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .select('id, salon_id, staff_id, start_time, end_time, reason, recurring_rule, created_by_id, created_at')
    .eq('salon_id', salonId)
    .gte('start_time', now)
    .order('start_time', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get a single blocked time by ID
 */
export async function getBlockedTimeById(id: string): Promise<BlockedTime> {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Fetch and verify ownership/scope
  const { data, error } = await supabase
    .schema('scheduling')
    .from('blocked_times')
    .select('id, salon_id, staff_id, start_time, end_time, reason, recurring_rule, created_by_id, created_at')
    .eq('id', id)
    .maybeSingle<BlockedTime & { salon_id: string | null }>()

  if (error) throw error
  if (!data?.salon_id || !(await canAccessSalon(data.salon_id))) {
    throw new Error('Unauthorized: Blocked time not found for your salon')
  }

  return data
}

/**
 * Get salon for current user (for blocked times)
 */
export async function getBlockedTimesSalon(): Promise<{ id: string }> {
  // SECURITY: Require authentication
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  return { id: salonId }
}
