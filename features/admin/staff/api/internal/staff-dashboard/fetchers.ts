import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'

import { APPOINTMENT_LOOKBACK_DAYS, MAX_APPOINTMENT_SAMPLE, MAX_REVIEW_SAMPLE } from './constants'
import type { AppointmentRow, BackgroundRow, MetadataRow, ReviewRow } from './types'

export async function fetchBackgroundChecks(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userIds: string[],
) {
  if (!userIds.length) return new Map<string, BackgroundRow>()

  const { data, error } = await supabase
    .schema('private')
    .from('user_sensitive_data')
    .select('user_id, background_check_status, background_check_date')
    .in('user_id', userIds)

  if (error) throw error

  return new Map<string, BackgroundRow>(
    (data || [])
      .filter((row): row is BackgroundRow => Boolean(row.user_id))
      .map((row) => [row.user_id, { ...row }]),
  )
}

export async function fetchProfileMetadata(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userIds: string[],
) {
  if (!userIds.length) return new Map<string, MetadataRow>()

  const { data, error } = await supabase
    .from('profiles_metadata')
    .select('profile_id, tags')
    .in('profile_id', userIds)

  if (error) throw error

  return new Map<string, MetadataRow>(
    (data || [])
      .filter((row): row is MetadataRow => Boolean(row.profile_id))
      .map((row) => [row.profile_id, { profile_id: row.profile_id, tags: row.tags ?? null }]),
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
  appointmentIds: (string | null)[],
) {
  if (!appointmentIds.length) return [] as ReviewRow[]

  const validIds = appointmentIds.filter(Boolean) as string[]
  if (!validIds.length) return [] as ReviewRow[]

  const { data, error } = await supabase
    .schema('engagement')
    .from('salon_reviews')
    .select('appointment_id, rating, is_flagged, customer_id, created_at')
    .in('appointment_id', validIds)
    .limit(MAX_REVIEW_SAMPLE)

  if (error) throw error
  return (data || []) as ReviewRow[]
}
