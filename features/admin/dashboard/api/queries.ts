import 'server-only'
import { cache } from 'react'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import type { SalonView } from '@/lib/types/app.types'

type AnalyticsOverview = Database['public']['Views']['admin_analytics_overview']['Row']
type RevenueOverview = Database['public']['Views']['admin_revenue_overview']['Row']
type AppointmentsOverview = Database['public']['Views']['admin_appointments_overview']['Row']
type ReviewsOverview = Database['public']['Views']['admin_reviews_overview']['Row']
type InventoryOverview = Database['public']['Views']['admin_inventory_overview']['Row']
type MessagesOverview = Database['public']['Views']['admin_messages_overview']['Row']
type StaffOverview = Database['public']['Views']['admin_staff_overview']['Row']

export const getPlatformMetrics = cache(async () => {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  try {
    // Get latest platform analytics from admin_analytics_overview view
    const { data: analytics, error: analyticsError } = await supabase
      .from('admin_analytics_overview')
      .select('*')
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (analyticsError) {
      console.error('Error fetching analytics:', analyticsError)
    }

    if (analytics) {
      return {
        totalSalons: analytics.active_salons || 0,
        totalUsers: (analytics.platform_new_customers || 0) + (analytics.platform_returning_customers || 0),
        totalAppointments: analytics.platform_appointments || 0,
        activeAppointments: analytics.platform_completed_appointments || 0,
        revenue: analytics.platform_revenue || 0,
        avgUtilization: analytics.avg_utilization_rate || 0,
      }
    }

    // Fallback to individual counts if analytics view has no data
    // Use Promise.all for parallel execution instead of sequential
    const now = new Date().toISOString()
    const [
      { count: salonsCount },
      { count: usersCount },
      { count: appointmentsCount },
      { count: activeAppointmentsCount }
    ] = await Promise.all([
      supabase.from('salons').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('start_time', now)
    ])

    return {
      totalSalons: salonsCount || 0,
      totalUsers: usersCount || 0,
      totalAppointments: appointmentsCount || 0,
      activeAppointments: activeAppointmentsCount || 0,
      revenue: 0,
      avgUtilization: 0,
    }
  } catch (error) {
    console.error('Error in getPlatformMetrics:', error)
    return {
      totalSalons: 0,
      totalUsers: 0,
      totalAppointments: 0,
      activeAppointments: 0,
      revenue: 0,
      avgUtilization: 0,
    }
  }
})

export const getRecentSalons = cache(async (): Promise<SalonView[]> => {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  // Use admin_salons_overview for enriched salon data
  const { data, error } = await supabase
    .from('admin_salons_overview')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) throw error
  return data || []
})

export const getUserStats = cache(async () => {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  // Get user role distribution
  const { data: roleDistribution, error } = await supabase
    .from('user_roles')
    .select('role')

  if (error) throw error

  const roleCounts = (roleDistribution || []).reduce(
    (acc, { role }) => {
      acc[role] = (acc[role] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  // Get additional stats from admin_users_overview
  const { count: totalUsers } = await supabase
    .from('admin_users_overview')
    .select('*', { count: 'exact', head: true })

  return {
    roleCounts,
    totalUsers: totalUsers || roleDistribution?.length || 0,
  }
})

/**
 * Get comprehensive admin overview data from all admin views
 * This integrates unused admin overview views for better insights
 */
export const getAdminOverview = cache(async () => {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = await createClient()

  try {
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

    return {
      analytics: analyticsData.data,
      revenue: revenueData.data || [],
      appointments: appointmentsData.data || [],
      reviews: reviewsData.data || [],
      inventory: inventoryData.data || [],
      messages: messagesData.data || [],
      staff: staffData.data || [],
    }
  } catch (error) {
    console.error('Error in getAdminOverview:', error)
    throw error
  }
})
