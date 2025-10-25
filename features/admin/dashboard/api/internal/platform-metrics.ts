import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { logSupabaseError } from '@/lib/supabase/errors'
import type { PlatformMetrics, AdminRevenueOverviewRow, SecurityIncidentLogRow } from './types'
import { safeCountFromSettled } from './helpers'

export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const now = new Date().toISOString()

  // Use Promise.allSettled to prevent one failure from breaking all queries
  const countResults = await Promise.allSettled([
    supabase.from('admin_salons_overview_view').select('id', { count: 'exact', head: true }),
    supabase.from('admin_users_overview_view').select('id', { count: 'exact', head: true }),
    supabase.from('admin_appointments_overview_view').select('id', { count: 'exact', head: true }),
    supabase
      .from('admin_appointments_overview_view')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed'),
    supabase
      .from('admin_appointments_overview_view')
      .select('id', { count: 'exact', head: true })
      .gte('start_time', now),
  ])

  const totalSalons = safeCountFromSettled(countResults[0], 'totalSalons')
  const totalUsers = safeCountFromSettled(countResults[1], 'totalUsers')
  const totalAppointments = safeCountFromSettled(countResults[2], 'totalAppointments')
  const completedAppointments = safeCountFromSettled(countResults[3], 'completedAppointments')
  const activeAppointments = safeCountFromSettled(countResults[4], 'activeAppointments')

  // Calculate active users timestamp once
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()

  // Parallelize independent metric queries (PERF-M302)
  const [
    { data: revenueData, error: revenueError },
    { data: activeUsersData, error: activeUsersError },
    { count: unverifiedCount, error: unverifiedError },
  ] = await Promise.all([
    // Total platform revenue from admin_revenue_overview
    supabase.from('admin_revenue_overview_view').select('total_revenue'),
    // Active users (users with activity in last 30 days)
    supabase
      .from('security_incident_logs_view')
      .select('user_id')
      .gte('created_at', thirtyDaysAgoISO)
      .not('user_id', 'is', null)
      .limit(10000), // Safety limit to prevent OOM
    // Pending verifications (unverified email users)
    supabase.from('admin_users_overview_view').select('*', { count: 'exact', head: true }).eq('email_verified', false),
  ])

  // Process revenue data
  let totalRevenue = 0
  if (!revenueError && revenueData) {
    totalRevenue = revenueData.reduce(
      (sum, row: Pick<AdminRevenueOverviewRow, 'total_revenue'>) => sum + (Number(row.total_revenue) || 0),
      0
    )
  } else if (revenueError) {
    logSupabaseError('getPlatformMetrics:revenue', revenueError)
  }

  // Process active users data
  let activeUsersCount = 0
  if (!activeUsersError && activeUsersData) {
    const uniqueUserIds = new Set(
      (activeUsersData as Pick<SecurityIncidentLogRow, 'user_id'>[])
        .map((log) => log.user_id)
        .filter((id): id is string => id !== null && id !== undefined)
    )
    activeUsersCount = uniqueUserIds.size
  } else if (activeUsersError) {
    logSupabaseError('getPlatformMetrics:activeUsers', activeUsersError)
  }

  // Process pending verifications
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
