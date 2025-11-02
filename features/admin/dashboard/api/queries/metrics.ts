import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { logSupabaseError } from '@/lib/supabase/errors'
import { createOperationLogger } from '@/lib/observability/logger'
import { QUERY_LIMITS } from '@/lib/config/constants'

export async function getPlatformMetrics() {
  const logger = createOperationLogger('getPlatformMetrics', {})
  logger.start()

  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const now = new Date().toISOString()

  // Use Promise.allSettled to prevent one failure from breaking all queries
  const countResults = await Promise.allSettled([
    supabase.from('salons_view').select('id', { count: 'exact', head: true }),
    supabase.from('profiles_view').select('id', { count: 'exact', head: true }),
    supabase.from('appointments_view').select('id', { count: 'exact', head: true }),
    supabase
      .from('appointments_view')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed'),
    supabase
      .from('appointments_view')
      .select('id', { count: 'exact', head: true })
      .gte('start_time', now),
  ])

  // Safely extract counts from settled promises
  const safeCountFromSettled = (
    result: PromiseSettledResult<{ count: number | null; error: unknown }>,
    context: string
  ): number => {
    if (result.status === 'rejected') {
      logSupabaseError(`getPlatformMetrics:${context}`, result.reason)
      return 0
    }
    if (result.value.error) {
      logSupabaseError(`getPlatformMetrics:${context}`, result.value.error)
      return 0
    }
    return typeof result.value.count === 'number' ? result.value.count : 0
  }

  const totalSalons = safeCountFromSettled(countResults[0], 'totalSalons')
  const totalUsers = safeCountFromSettled(countResults[1], 'totalUsers')
  const totalAppointments = safeCountFromSettled(countResults[2], 'totalAppointments')
  const completedAppointments = safeCountFromSettled(countResults[3], 'completedAppointments')
  const activeAppointments = safeCountFromSettled(countResults[4], 'activeAppointments')

  // Calculate total platform revenue from analytics.daily_metrics
  const { data: revenueData, error: revenueError } = await supabase
    .schema('analytics')
    .from('daily_metrics')
    .select('total_revenue')

  let totalRevenue = 0
  if (!revenueError && revenueData) {
    totalRevenue = revenueData.reduce((sum, row) => sum + (Number(row.total_revenue) || 0), 0)
  } else if (revenueError) {
    logSupabaseError('getPlatformMetrics:revenue', revenueError)
  }

  // Calculate active users (users with activity in last 30 days)
  // PERFORMANCE: Use RPC function to count distinct users efficiently
  // This prevents scanning millions of audit log rows
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()

  let activeUsersCount = 0

  // Query audit logs to count active users (users with activity in last 30 days)
  const { data: activeUsersData, error: activeUsersError } = await supabase
    .schema('identity')
    .from('audit_logs')
    .select('user_id')
    .gte('created_at', thirtyDaysAgoISO)
    .not('user_id', 'is', null)
    .limit(QUERY_LIMITS.ADMIN_MAX) // Admin query limit - fetch up to 10k records for dashboard

  if (!activeUsersError && activeUsersData) {
    const uniqueUserIds = new Set(
      activeUsersData
        .map((log) => log.user_id)
        .filter((id): id is string => id !== null && id !== undefined),
    )
    activeUsersCount = uniqueUserIds.size
  } else if (activeUsersError) {
    logSupabaseError('getPlatformMetrics:activeUsers', activeUsersError)
  }

  // Calculate pending verifications (unverified email users)
  // Note: email_verified is in auth.users, not accessible via row-level security in this context
  // For now, using identity.profiles as proxy - this may need adjustment based on actual auth schema
  const { count: unverifiedCount, error: unverifiedError } = await supabase
    .from('profiles_view')
    .select('id', { count: 'exact', head: true })
    .is('deleted_at', null)
    .limit(1)

  let pendingVerifications = 0
  if (!unverifiedError) {
    pendingVerifications = unverifiedCount || 0
  } else {
    logSupabaseError('getPlatformMetrics:pendingVerifications', unverifiedError)
  }

  return {
    totalSalons,
    totalUsers,
    totalAppointments,
    activeAppointments,
    completedAppointments,
    revenue: totalRevenue,
    activeUsers: activeUsersCount,
    pendingVerifications,
    // avgUtilization calculation requires historical data from admin_analytics_overview
    // Once daily_metrics are populated, query admin_analytics_overview.avg_utilization_rate
    // For now, returning 0 as placeholder until sufficient historical data exists
    avgUtilization: 0,
  }
}
