import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { logSupabaseError } from '@/lib/supabase/errors'
import type {
  AdminOverview,
  AdminAnalyticsOverviewRow,
  AdminRevenueOverviewRow,
  AdminAppointmentsOverviewRow,
  AdminReviewsOverviewRow,
  AdminMessagesOverviewRow,
  AdminStaffOverviewRow,
} from './types'

/**
 * Get comprehensive admin overview data from all admin views
 * This integrates unused admin overview views for better insights
 */
export async function getAdminOverview(): Promise<AdminOverview> {
  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  // Query each view independently to handle errors gracefully
  const [
    analyticsData,
    revenueData,
    appointmentsData,
    reviewsData,
    messagesData,
    staffData,
  ] = await Promise.all([
    supabase.from('admin_analytics_overview_view').select('*').order('date', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('admin_revenue_overview_view').select('*').order('date', { ascending: false }).limit(10),
    supabase.from('admin_appointments_overview_view').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('admin_reviews_overview_view').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('admin_messages_overview_view').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('admin_staff_overview_view').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  // Log errors for debugging but don't throw - allow dashboard to load with partial data
  if (analyticsData.error) logSupabaseError('admin_analytics_overview_view', analyticsData.error)
  if (revenueData.error) logSupabaseError('admin_revenue_overview_view', revenueData.error)
  if (appointmentsData.error) logSupabaseError('admin_appointments_overview_view', appointmentsData.error)
  if (reviewsData.error) logSupabaseError('admin_reviews_overview_view', reviewsData.error)
  if (messagesData.error) logSupabaseError('admin_messages_overview_view', messagesData.error)
  if (staffData.error) logSupabaseError('admin_staff_overview_view', staffData.error)

  return {
    analytics: (analyticsData.data as AdminAnalyticsOverviewRow | null) ?? null,
    revenue: (revenueData.data as AdminRevenueOverviewRow[] | null) ?? [],
    appointments: (appointmentsData.data as AdminAppointmentsOverviewRow[] | null) ?? [],
    reviews: (reviewsData.data as AdminReviewsOverviewRow[] | null) ?? [],
    messages: (messagesData.data as AdminMessagesOverviewRow[] | null) ?? [],
    staff: (staffData.data as AdminStaffOverviewRow[] | null) ?? [],
  }
}
