import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { logSupabaseError } from '@/lib/supabase/errors'
import type { DashboardUserStats, AdminUsersOverviewRow } from './types'

export async function getUserStats(): Promise<DashboardUserStats> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  // Get user role distribution
  const { data: roleDistribution, error } = await supabase
    .from('admin_users_overview_view')
    .select('roles')

  if (error) {
    logSupabaseError('getUserStats:roleDistribution', error)
    return { roleCounts: {}, totalUsers: 0 }
  }

  const roleCounts = (roleDistribution || []).reduce<Record<string, number>>(
    (acc, row: Pick<AdminUsersOverviewRow, 'roles'>) => {
      if (Array.isArray(row.roles)) {
        row.roles.forEach((role) => {
          if (role) {
            acc[role] = (acc[role] || 0) + 1
          }
        })
      }
      return acc
    },
    {}
  )

  // Get additional stats from admin_users_overview
  const { count: totalUsers, error: countError } = await supabase
    .from('admin_users_overview_view')
    .select('id', { count: 'exact', head: true })

  if (countError) {
    logSupabaseError('getUserStats:totalUsers', countError)
  }

  return {
    roleCounts,
    totalUsers: totalUsers || roleDistribution?.length || 0,
  }
}
