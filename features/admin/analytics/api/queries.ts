import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// Use actual database views
type AdminAnalytics = Database['public']['Views']['admin_analytics_overview']['Row']
type AdminAppointment = Database['public']['Views']['admin_appointments_overview']['Row']
type AdminSalon = Database['public']['Views']['admin_salons_overview']['Row']
type AdminUser = Database['public']['Views']['admin_users_overview']['Row']
type AdminReview = Database['public']['Views']['admin_reviews_overview']['Row']
type AdminStaff = Database['public']['Views']['admin_staff_overview']['Row']
type AdminInventory = Database['public']['Views']['admin_inventory_overview']['Row']
type AdminRevenue = Database['public']['Views']['admin_revenue_overview']['Row']
type AdminMessage = Database['public']['Views']['admin_messages_overview']['Row']

/**
 * Get platform analytics overview
 * SECURITY: Platform admin only
 */
export async function getPlatformAnalytics(limit = 30): Promise<AdminAnalytics[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_analytics_overview')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

/**
 * Get all appointments overview
 * SECURITY: Platform admin only
 */
export async function getAllAppointments(limit = 100): Promise<AdminAppointment[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_appointments_overview')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

/**
 * Get all salons overview
 * SECURITY: Platform admin only
 */
export async function getAllSalons(): Promise<AdminSalon[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_salons_overview')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get all users overview
 * SECURITY: Platform admin only
 */
export async function getAllUsers(): Promise<AdminUser[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_users_overview')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get all reviews overview
 * SECURITY: Platform admin only
 */
export async function getAllReviews(limit = 100): Promise<AdminReview[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_reviews_overview')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

/**
 * Get all staff overview
 * SECURITY: Platform admin only
 */
export async function getAllStaff(): Promise<AdminStaff[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_staff_overview')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get inventory overview
 * SECURITY: Platform admin only
 */
export async function getInventoryOverview(): Promise<AdminInventory[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_inventory_overview')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get revenue overview
 * SECURITY: Platform admin only
 */
export async function getRevenueOverview(limit = 30): Promise<AdminRevenue[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_revenue_overview')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

/**
 * Get messages overview
 * SECURITY: Platform admin only
 */
export async function getMessagesOverview(limit = 100): Promise<AdminMessage[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_messages_overview')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

/**
 * Get platform summary statistics
 * SECURITY: Platform admin only
 */
export async function getPlatformSummary() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = await createClient()

  // Get analytics overview for summary stats
  const { data: analytics } = await supabase
    .from('admin_analytics_overview')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .single()

  // Get total counts
  const [
    { count: totalUsers },
    { count: totalSalons },
    { count: totalAppointments },
    { count: totalReviews },
  ] = await Promise.all([
    supabase.from('admin_users_overview').select('*', { count: 'exact', head: true }),
    supabase.from('admin_salons_overview').select('*', { count: 'exact', head: true }),
    supabase.from('admin_appointments_overview').select('*', { count: 'exact', head: true }),
    supabase.from('admin_reviews_overview').select('*', { count: 'exact', head: true }),
  ])

  return {
    totals: {
      users: totalUsers || 0,
      salons: totalSalons || 0,
      appointments: totalAppointments || 0,
      reviews: totalReviews || 0,
    },
    latest: analytics || null,
  }
}
