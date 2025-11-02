import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability/logger'

export async function getUserStats() {
  const logger = createOperationLogger('getUserStats', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { count: totalUsers } = await supabase
    .from('profiles_view')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)

  const { data: roleDistribution } = await supabase
    .from('admin_users_overview_view')
    .select('primary_role')
    .is('deleted_at', null)

  const roleCounts = (roleDistribution || []).reduce(
    (acc, { primary_role }) => {
      if (primary_role) {
        acc[primary_role] = (acc[primary_role] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: activeUsers } = await supabase
    .from('admin_users_overview_view')
    .select('*', { count: 'exact', head: true })
    .gte('last_active', thirtyDaysAgo.toISOString())
    .is('deleted_at', null)

  return {
    total: totalUsers || 0,
    active: activeUsers || 0,
    byRole: roleCounts,
  }
}

export async function getUsersOverview() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const { count: totalUsers } = await supabase
    .from('profiles_view')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)

  const { count: suspendedUsers } = await supabase
    .from('profiles_view')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', false)
    .is('deleted_at', null)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: activeUsers } = await supabase
    .from('admin_users_overview_view')
    .select('*', { count: 'exact', head: true })
    .gte('last_active', thirtyDaysAgo.toISOString())
    .is('deleted_at', null)

  const { count: usersWithRoles } = await supabase
    .from('user_roles_view')
    .select('user_id', { count: 'exact', head: true })
    .eq('is_active', true)

  const { data: roles } = await supabase
    .from('user_roles_view')
    .select('role')
    .eq('is_active', true)

  const roleBreakdown = Object.entries(
    (roles || []).reduce(
      (acc, { role }) => {
        if (!role) {
          return acc
        }
        acc[role] = (acc[role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([role, count]) => ({ role, count }))

  return {
    totalUsers: totalUsers || 0,
    activeUsers: activeUsers || 0,
    suspendedUsers: suspendedUsers || 0,
    usersWithRoles: usersWithRoles || 0,
    roleBreakdown,
  }
}
