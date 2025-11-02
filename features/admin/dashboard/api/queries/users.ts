import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { logSupabaseError } from '@/lib/supabase/errors'
import { createOperationLogger } from '@/lib/observability'

export async function getUserStats() {
  const logger = createOperationLogger('getUserStats', {})
  logger.start()

  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  // Get user role distribution
  const { data: roleDistribution, error } = await supabase
    .schema('identity')
    .from('user_roles')
    .select('role')

  if (error) {
    logSupabaseError('getUserStats:roleDistribution', error)
    return { roleCounts: {}, totalUsers: 0 }
  }

  const roleCounts = (roleDistribution || []).reduce<Record<string, number>>(
    (acc, row) => {
      if (row && typeof row === 'object' && 'role' in row && typeof row.role === 'string') {
        const role = row.role
        acc[role] = (acc[role] || 0) + 1
      }
      return acc
    },
    {}
  )

  // Get additional stats from identity.profiles
  const { count: totalUsers, error: countError } = await supabase
    .from('profiles_view')
    .select('id', { count: 'exact', head: true })

  if (countError) {
    logSupabaseError('getUserStats:totalUsers', countError)
  }

  return {
    roleCounts,
    totalUsers: totalUsers || roleDistribution?.length || 0,
  }
}
