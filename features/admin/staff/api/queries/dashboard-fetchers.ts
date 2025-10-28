import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'

import {
  APPOINTMENT_LOOKBACK_DAYS,
  MAX_APPOINTMENT_SAMPLE,
  MAX_REVIEW_SAMPLE,
} from './dashboard-constants'
import type { AppointmentRow, BackgroundRow, MetadataRow, ReviewRow } from './types'

export async function fetchBackgroundChecks(
  _supabase: ReturnType<typeof createServiceRoleClient>,
  _userIds: string[],
) {
  // NOTE: Background check functionality disabled - table 'private.user_sensitive_data' does not exist in database
  // Database is source of truth - this feature cannot be implemented until the table is created
  // TODO: Create private.user_sensitive_data table if background checks are needed
  return new Map<string, BackgroundRow>()
}

export async function fetchProfileMetadata(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userIds: string[],
) {
  if (!userIds.length) return new Map<string, MetadataRow>()

  const { data, error } = await supabase
    .from('profiles_metadata_view')
    .select('profile_id, tags')
    .in('profile_id', userIds)

  if (error) throw error

  return new Map<string, MetadataRow>(
    (data || [])
      .filter((row) => Boolean(row?.profile_id))
      .map((row) => ({
        profile_id: row.profile_id as string,
        tags: row.tags ?? null,
      }))
      .map((row) => [row.profile_id, row]),
  )
}

export async function fetchRecentAppointments(
  supabase: ReturnType<typeof createServiceRoleClient>,
  staffIds: string[],
) {
  if (!staffIds.length) return [] as AppointmentRow[]

  const since = new Date()
  since.setDate(since.getDate() - APPOINTMENT_LOOKBACK_DAYS)

  const { data, error } = await supabase
    .from('admin_appointments_overview_view')
    .select('id, staff_id, status, start_time, duration_minutes, salon_id')
    .in('staff_id', staffIds)
    .gte('start_time', since.toISOString())
    .limit(MAX_APPOINTMENT_SAMPLE)

  if (error) throw error
  return (data || []) as AppointmentRow[]
}

export async function fetchReviewSample(
  supabase: ReturnType<typeof createServiceRoleClient>,
  _appointmentIds: (string | null)[],
) {
  // NOTE: salon_reviews_view does not have appointment_id column
  // Fetch recent reviews without appointment filtering
  const { data, error } = await supabase
    .from('salon_reviews_view')
    .select('id, rating, is_flagged, customer_id, created_at')
    .order('created_at', { ascending: false })
    .limit(MAX_REVIEW_SAMPLE)

  if (error) throw error
  return (data || []).map(row => ({
    id: row.id ?? '',
    rating: row.rating,
    is_flagged: row.is_flagged,
    customer_id: row.customer_id,
    created_at: row.created_at,
  })) as ReviewRow[]
}
