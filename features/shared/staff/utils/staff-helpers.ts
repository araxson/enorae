import 'server-only'
import { createClient } from '@/lib/supabase/server'

/**
 * Staff-related helper utilities
 * Consolidates staff ID resolution pattern used across 7+ files
 */

/**
 * Resolve staff ID from user ID
 * Returns null if user is not a staff member
 */
export async function resolveStaffId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle<{ id: string | null }>()

  if (error) throw error
  return data?.id ?? null
}

/**
 * Resolve staff ID and throw if not found
 * Use when staff access is required
 */
export async function requireStaffId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string> {
  const staffId = await resolveStaffId(supabase, userId)
  if (!staffId) {
    throw new Error('Unauthorized: Staff access required')
  }
  return staffId
}

/**
 * Check if user is a staff member
 */
export async function isStaffMember(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<boolean> {
  const staffId = await resolveStaffId(supabase, userId)
  return staffId !== null
}

/**
 * Get staff profile with details
 */
export async function getStaffProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
) {
  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('id, user_id, salon_id, staff_role, title, experience_years, is_active, created_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}
