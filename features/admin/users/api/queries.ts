import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type AdminUser = Database['public']['Views']['admin_users_overview']['Row']
type Profile = Database['public']['Views']['profiles']['Row']
type UserRole = Database['public']['Views']['user_roles']['Row']

export interface UserFilters {
  role?: string
  search?: string
  salon_id?: string
  is_deleted?: boolean
}

/**
 * Get all users with aggregated data
 * SECURITY: Platform admin only
 */
export async function getAllUsers(filters?: UserFilters): Promise<AdminUser[]> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  let query = supabase
    .from('admin_users_overview')
    .select('*')
    .order('created_at', { ascending: false })

  // Apply filters
  if (filters?.search) {
    query = query.or(
      `full_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%`
    )
  }

  if (filters?.is_deleted !== undefined) {
    if (filters.is_deleted) {
      query = query.not('deleted_at', 'is', null)
    } else {
      query = query.is('deleted_at', null)
    }
  } else {
    // Default: exclude deleted users
    query = query.is('deleted_at', null)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

/**
 * Get single user by ID with full details
 * SECURITY: Platform admin only
 */
export async function getUserById(userId: string): Promise<AdminUser | null> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_users_overview')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

/**
 * Get user profile with metadata
 * SECURITY: Platform admin only
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

/**
 * Get user's active roles
 * SECURITY: Platform admin only
 */
export async function getUserRoles(userId: string): Promise<UserRole[]> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get user's active sessions
 * SECURITY: Platform admin only
 */
export async function getUserSessions(userId: string) {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Search users by email, name, or username
 * SECURITY: Platform admin only
 */
export async function searchUsers(searchTerm: string): Promise<AdminUser[]> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_users_overview')
    .select('*')
    .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data || []
}

/**
 * Get users by role
 * SECURITY: Platform admin only
 */
export async function getUsersByRole(
  role: Database['public']['Enums']['role_type']
): Promise<AdminUser[]> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_users_overview')
    .select('*')
    .contains('roles', [role])
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get user statistics
 * SECURITY: Platform admin only
 */
export async function getUserStats() {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  // Get total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)

  // Get users by primary role
  const { data: roleDistribution } = await supabase
    .from('admin_users_overview')
    .select('primary_role')
    .is('deleted_at', null)

  const roleCounts = (roleDistribution || []).reduce(
    (acc, { primary_role }) => {
      if (primary_role) {
        acc[primary_role] = (acc[primary_role] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>
  )

  // Get active users (logged in within last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: activeUsers } = await supabase
    .from('admin_users_overview')
    .select('*', { count: 'exact', head: true })
    .gte('last_active', thirtyDaysAgo.toISOString())
    .is('deleted_at', null)

  return {
    total: totalUsers || 0,
    active: activeUsers || 0,
    byRole: roleCounts,
  }
}

/**
 * Get users overview with statistics
 * SECURITY: Platform admin only
 */
export async function getUsersOverview() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  // Get counts
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)

  const { count: suspendedUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', false)
    .is('deleted_at', null)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: activeUsers } = await supabase
    .from('admin_users_overview')
    .select('*', { count: 'exact', head: true })
    .gte('last_active', thirtyDaysAgo.toISOString())
    .is('deleted_at', null)

  const { count: usersWithRoles } = await supabase
    .from('user_roles')
    .select('user_id', { count: 'exact', head: true })
    .eq('is_active', true)

  // Get role breakdown
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('is_active', true)

  const roleBreakdown = Object.entries(
    (roles || []).reduce(
      (acc, { role }) => {
        acc[role] = (acc[role] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
  ).map(([role, count]) => ({ role, count }))

  return {
    totalUsers: totalUsers || 0,
    activeUsers: activeUsers || 0,
    suspendedUsers: suspendedUsers || 0,
    usersWithRoles: usersWithRoles || 0,
    roleBreakdown,
  }
}

/**
 * Get all users with detailed information
 * SECURITY: Platform admin only
 */
export async function getUsersWithDetails() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_users_overview')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
