import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { logSupabaseError } from '@/lib/supabase/errors'
import type { AdminSalon } from '@/lib/types/app.types'

export async function getPlatformMetrics() {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const now = new Date().toISOString()

  // Use Promise.allSettled to prevent one failure from breaking all queries
  const countResults = await Promise.allSettled([
    supabase.from('admin_salons_overview').select('id', { count: 'exact', head: true }),
    supabase.from('admin_users_overview').select('id', { count: 'exact', head: true }),
    supabase.from('admin_appointments_overview').select('id', { count: 'exact', head: true }),
    supabase
      .from('admin_appointments_overview')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed'),
    supabase
      .from('admin_appointments_overview')
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

  // Calculate total platform revenue from admin_revenue_overview
  const { data: revenueData, error: revenueError } = await supabase
    .from('admin_revenue_overview')
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

  // Try using RPC function for efficient counting (if exists)
  const { data: activeUsersRPC, error: rpcError } = await supabase
    .rpc('get_active_users_count', { days_ago: 30 })
    .maybeSingle()

  if (!rpcError && typeof activeUsersRPC === 'number') {
    activeUsersCount = activeUsersRPC
  } else {
    // Fallback: Query with LIMIT to prevent crashes at scale
    // TODO: Create database function get_active_users_count for better performance
    const { data: activeUsersData, error: activeUsersError } = await supabase
      .schema('audit')
      .from('audit_logs')
      .select('user_id')
      .gte('created_at', thirtyDaysAgoISO)
      .not('user_id', 'is', null)
      .limit(10000) // Safety limit to prevent OOM

    if (!activeUsersError && activeUsersData) {
      // Filter out any null user_ids and create unique set
      const uniqueUserIds = new Set(
        activeUsersData
          .map(log => log.user_id)
          .filter((id): id is string => id !== null && id !== undefined)
      )
      activeUsersCount = uniqueUserIds.size
    } else if (activeUsersError) {
      logSupabaseError('getPlatformMetrics:activeUsers', activeUsersError)
    }
  }

  // Calculate low stock alerts count
  const { count: lowStockCount, error: lowStockError } = await supabase
    .from('stock_alerts')
    .select('*', { count: 'exact', head: true })
    .eq('is_resolved', false)

  let lowStockAlertsCount = 0
  if (!lowStockError) {
    lowStockAlertsCount = lowStockCount || 0
  } else {
    logSupabaseError('getPlatformMetrics:lowStockAlerts', lowStockError)
  }

  // Calculate pending verifications (unverified email users)
  const { count: unverifiedCount, error: unverifiedError } = await supabase
    .from('admin_users_overview')
    .select('*', { count: 'exact', head: true })
    .eq('email_verified', false)

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
    lowStockAlerts: lowStockAlertsCount,
    pendingVerifications,
    // avgUtilization calculation requires historical data from admin_analytics_overview
    // Once daily_metrics are populated, query admin_analytics_overview.avg_utilization_rate
    // For now, returning 0 as placeholder until sufficient historical data exists
    avgUtilization: 0,
  }
}

export async function getRecentSalons(): Promise<AdminSalon[]> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  // Use admin_salons_overview for enriched salon data
  const { data, error } = await supabase
    .from('admin_salons_overview')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    logSupabaseError('getRecentSalons', error)
    return []
  }
  return (data || []) as AdminSalon[]
}

export async function getUserStats() {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  // Get user role distribution
  const { data: roleDistribution, error } = await supabase
    .from('admin_users_overview')
    .select('roles')

  if (error) {
    logSupabaseError('getUserStats:roleDistribution', error)
    return { roleCounts: {}, totalUsers: 0 }
  }

  const roleCounts = (roleDistribution || []).reduce<Record<string, number>>(
    (acc, row) => {
      if (Array.isArray(row.roles)) {
        row.roles.forEach((role) => {
          acc[role] = (acc[role] || 0) + 1
        })
      }
      return acc
    },
    {}
  )

  // Get additional stats from admin_users_overview
  const { count: totalUsers, error: countError } = await supabase
    .from('admin_users_overview')
    .select('id', { count: 'exact', head: true })

  if (countError) {
    logSupabaseError('getUserStats:totalUsers', countError)
  }

  return {
    roleCounts,
    totalUsers: totalUsers || roleDistribution?.length || 0,
  }
}

/**
 * Get comprehensive admin overview data from all admin views
 * This integrates unused admin overview views for better insights
 */
export async function getAdminOverview() {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  // Query each view independently to handle errors gracefully
  const [
    analyticsData,
    revenueData,
    appointmentsData,
    reviewsData,
    inventoryData,
    messagesData,
    staffData,
  ] = await Promise.all([
    supabase.from('admin_analytics_overview').select('*').order('date', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('admin_revenue_overview').select('*').order('date', { ascending: false }).limit(10),
    supabase.from('admin_appointments_overview').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('admin_reviews_overview').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('admin_inventory_overview').select('*').limit(10),
    supabase.from('admin_messages_overview').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('admin_staff_overview').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  // Log errors for debugging but don't throw - allow dashboard to load with partial data
  if (analyticsData.error) logSupabaseError('admin_analytics_overview', analyticsData.error)
  if (revenueData.error) logSupabaseError('admin_revenue_overview', revenueData.error)
  if (appointmentsData.error) logSupabaseError('admin_appointments_overview', appointmentsData.error)
  if (reviewsData.error) logSupabaseError('admin_reviews_overview', reviewsData.error)
  if (inventoryData.error) logSupabaseError('admin_inventory_overview', inventoryData.error)
  if (messagesData.error) logSupabaseError('admin_messages_overview', messagesData.error)
  if (staffData.error) logSupabaseError('admin_staff_overview', staffData.error)

  return {
    analytics: analyticsData.data,
    revenue: revenueData.data || [],
    appointments: appointmentsData.data || [],
    reviews: reviewsData.data || [],
    inventory: inventoryData.data || [],
    messages: messagesData.data || [],
    staff: staffData.data || [],
  }
}