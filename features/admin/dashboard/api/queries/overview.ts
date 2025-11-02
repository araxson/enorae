import 'server-only'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { logSupabaseError } from '@/lib/supabase/errors'
import { createOperationLogger } from '@/lib/observability'

/**
 * Get comprehensive admin overview data from all admin views
 * This integrates unused admin overview views for better insights
 */
export async function getAdminOverview() {
  const logger = createOperationLogger('getAdminOverview', {})
  logger.start()

  // SECURITY: Require platform admin role
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  // Query each table independently to handle errors gracefully
  const [
    analyticsData,
    revenueData,
    appointmentsData,
    reviewsData,
    messagesData,
    staffData,
  ] = await Promise.all([
    supabase.schema('analytics').from('daily_metrics').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.schema('analytics').from('daily_metrics').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.schema('scheduling').from('appointments').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.schema('engagement').from('salon_reviews').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.schema('communication').from('messages').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.schema('organization').from('staff_profiles').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  // Log errors for debugging but don't throw - allow dashboard to load with partial data
  if (analyticsData.error) logSupabaseError('analytics.daily_metrics', analyticsData.error)
  if (revenueData.error) logSupabaseError('analytics.daily_metrics', revenueData.error)
  if (appointmentsData.error) logSupabaseError('scheduling.appointments', appointmentsData.error)
  if (reviewsData.error) logSupabaseError('engagement.salon_reviews', reviewsData.error)
  if (messagesData.error) logSupabaseError('communication.messages', messagesData.error)
  if (staffData.error) logSupabaseError('organization.staff_profiles', staffData.error)

  return {
    analytics: analyticsData.data,
    revenue: revenueData.data || [],
    appointments: appointmentsData.data || [],
    reviews: reviewsData.data || [],
    messages: messagesData.data || [],
    staff: staffData.data || [],
  }
}
