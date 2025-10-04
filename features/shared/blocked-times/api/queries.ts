import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type BlockedTime = Database['public']['Views']['blocked_times']['Row']

export type BlockedTimeWithRelations = BlockedTime & {
  staff: { id: string; full_name: string | null } | null
  salon: { id: string; name: string } | null
}

/**
 * Get all blocked times for a specific salon
 */
export async function getBlockedTimesBySalon(salonId: string) {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Explicit salon filter for security
  const { data, error } = await supabase
    .from('blocked_times')
    .select('*')
    .eq('salon_id', salonId)
    .order('start_time', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get all blocked times for a specific staff member
 */
export async function getBlockedTimesByStaff(staffId: string) {
  // SECURITY: Require staff or business role
  await requireAnyRole([...ROLE_GROUPS.STAFF_USERS, ...ROLE_GROUPS.BUSINESS_USERS])

  const supabase = await createClient()

  // Explicit staff filter for security
  const { data, error } = await supabase
    .from('blocked_times')
    .select('*')
    .eq('staff_id', staffId)
    .order('start_time', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get upcoming blocked times for a salon
 */
export async function getUpcomingBlockedTimes(salonId: string) {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const now = new Date().toISOString()

  // Explicit salon filter for security
  const { data, error } = await supabase
    .from('blocked_times')
    .select('*')
    .eq('salon_id', salonId)
    .gte('start_time', now)
    .order('start_time', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get a single blocked time by ID
 */
export async function getBlockedTimeById(id: string) {
  // SECURITY: Require business role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  // Explicit ID filter for security
  const { data, error} = await supabase
    .from('blocked_times')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Get salon for current user (for blocked times)
 */
export async function getBlockedTimesSalon() {
  // SECURITY: Require authentication
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()

  const { data: salon, error } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .single()

  if (error || !salon) {
    throw new Error('No salon found for your account')
  }

  return salon as { id: string }
}
