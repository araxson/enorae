import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type AdminUserRole = Database['public']['Views']['user_roles']['Row']

/**
 * Get all role assignments
 * SECURITY: Platform admin only
 */
export async function getAllRoleAssignments(): Promise<AdminUserRole[]> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_user_roles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get user's role assignments
 * SECURITY: Platform admin only
 */
export async function getUserRoleAssignments(
  userId: string
): Promise<AdminUserRole[]> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_user_roles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get salon's role assignments (staff members)
 * SECURITY: Platform admin only
 */
export async function getSalonRoleAssignments(
  salonId: string
): Promise<AdminUserRole[]> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_user_roles')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false})

  if (error) throw error
  return data || []
}

/**
 * Get role distribution stats
 * SECURITY: Platform admin only
 */
export async function getRoleStats() {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  const { data } = await supabase
    .from('admin_user_roles')
    .select('role, is_active')

  const stats = (data || []).reduce(
    (acc, { role, is_active }) => {
      const key = role as string
      if (!acc[key]) {
        acc[key] = { total: 0, active: 0, inactive: 0 }
      }
      acc[key].total++
      if (is_active) {
        acc[key].active++
      } else {
        acc[key].inactive++
      }
      return acc
    },
    {} as Record<string, { total: number; active: number; inactive: number }>
  )

  return stats
}
