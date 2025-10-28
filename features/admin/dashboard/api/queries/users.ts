import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { logSupabaseError } from '@/lib/supabase/errors'

export async function getUserStats() {
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
      const role = (row as any)?.role
      if (role) {
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
