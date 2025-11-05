import 'server-only'
import type { Database } from '@/lib/types/database.types'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { logSupabaseError } from '@/lib/supabase/errors'
import { createOperationLogger } from '@/lib/observability'
import type {
  RevenueOverview,
  AppointmentsOverview,
  ReviewsOverview,
  MessagesOverview,
  StaffOverview,
} from '../types'

type DailyMetricsRow = Database['analytics']['Tables']['daily_metrics']['Row']
type AppointmentRow = Database['scheduling']['Tables']['appointments']['Row']
type SalonReviewRow = Database['engagement']['Tables']['salon_reviews']['Row']
type MessageRow = Database['communication']['Tables']['messages']['Row']
type StaffProfileRow = Database['organization']['Tables']['staff_profiles']['Row']

// Subset types for what we actually select
type DailyMetricsSummary = Pick<DailyMetricsRow, 'id' | 'metric_at' | 'total_appointments' | 'total_revenue' | 'created_at'>
type AppointmentSummary = Pick<AppointmentRow, 'id' | 'salon_id' | 'customer_id' | 'staff_id' | 'start_time' | 'end_time' | 'status' | 'duration_minutes' | 'created_at'>
type ReviewSummary = Pick<SalonReviewRow, 'id' | 'salon_id' | 'customer_id' | 'rating' | 'comment' | 'created_at'>
type MessageSummary = Pick<MessageRow, 'id' | 'from_user_id' | 'to_user_id' | 'content' | 'created_at'>
type StaffSummary = Pick<StaffProfileRow, 'id' | 'salon_id' | 'user_id' | 'title' | 'bio' | 'experience_years' | 'created_at'>

/**
 * Get comprehensive admin overview data from all admin views
 * This integrates unused admin overview views for better insights
 */
export async function getAdminOverview(): Promise<{
  analytics: DailyMetricsSummary | null
  revenue: RevenueOverview[]
  appointments: AppointmentsOverview[]
  reviews: ReviewsOverview[]
  messages: MessagesOverview[]
  staff: StaffOverview[]
}> {
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
    supabase.schema('analytics').from('daily_metrics').select('id, metric_at, total_appointments, total_revenue, created_at').order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.schema('analytics').from('daily_metrics').select('id, metric_at, total_appointments, total_revenue, created_at').order('created_at', { ascending: false }).limit(10),
    supabase.schema('scheduling').from('appointments').select('id, salon_id, customer_id, staff_id, start_time, end_time, status, duration_minutes, created_at').order('created_at', { ascending: false }).limit(10),
    supabase.schema('engagement').from('salon_reviews').select('id, salon_id, customer_id, rating, comment, created_at').order('created_at', { ascending: false }).limit(10),
    supabase.schema('communication').from('messages').select('id, from_user_id, to_user_id, content, created_at').order('created_at', { ascending: false }).limit(10),
    supabase.schema('organization').from('staff_profiles').select('id, salon_id, user_id, title, bio, experience_years, created_at').order('created_at', { ascending: false }).limit(10),
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
    revenue: (revenueData.data || []) as RevenueOverview[],
    appointments: (appointmentsData.data || []) as AppointmentsOverview[],
    reviews: (reviewsData.data || []) as ReviewsOverview[],
    messages: (messagesData.data || []) as MessagesOverview[],
    staff: (staffData.data || []) as StaffOverview[],
  }
}
