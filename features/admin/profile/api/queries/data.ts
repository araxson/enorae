import 'server-only'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type {
  AdminUserRow,
  MetadataRow,
  PreferencesRow,
  UserRoleRow,
  AuditLogRow,
  ProfileSearchResult,
  ProfileSummary,
  ProfileMetadataDetail,
  ProfilePreferencesDetail,
  ProfileRoleSummary,
  ProfileActivityEntry,
  ProfileDetail,
} from './types'
import { sanitizeSearchTerm, toRecord, mapSummary } from '@/lib/utils/profile'

export async function searchProfiles(term: string, limit = 20): Promise<ProfileSearchResult[]> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()
  const sanitized = term.trim() ? sanitizeSearchTerm(term.trim()) : ''

  let query = supabase
    .from('admin_users_overview_view')
    .select('id, full_name, email, username, primary_role, roles, status')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (sanitized) {
    query = query.or(
      [
        `email.ilike.%${sanitized}%`,
        `full_name.ilike.%${sanitized}%`,
        `username.ilike.%${sanitized}%`,
      ].join(','),
    )
  }

  const { data, error } = await query

  if (error) {
    console.error('[AdminProfile] searchProfiles error', error)
    return []
  }

  return (data ?? []).map((row) => ({
    id: row['id'] ?? '',
    fullName: row['full_name'] ?? null,
    email: row['email'] ?? null,
    username: row.username ?? null,
    primaryRole: row.primary_role ?? null,
    roles: row.roles ?? [],
    status: row['status'] ?? null,
  }))
}

export async function getProfileDetail(profileId: string): Promise<ProfileDetail | null> {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const supabase = createServiceRoleClient()

  const [
    profileResponse,
    metadataResponse,
    preferencesResponse,
    rolesResponse,
    activityResponse,
  ] = await Promise.all([
    supabase.from('admin_users_overview_view').select('*').eq('id', profileId).maybeSingle(),
    supabase
      .from('profiles_metadata_view')
      .select('*')
      .eq('profile_id', profileId)
      .maybeSingle(),
    supabase
      .from('profiles_preferences_view')
      .select('*')
      .eq('profile_id', profileId)
      .maybeSingle(),
    supabase
      .from('user_roles_view')
      .select('id, role, salon_id, is_active, permissions, created_at')
      .eq('user_id', profileId)
      .order('created_at', { ascending: false }),
    supabase
      .schema('identity')
      .from('audit_logs_view')
      .select(
        'id, created_at, action, entity_type, entity_id, ip_address, user_agent',
      )
      .eq('user_id', profileId)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  if (profileResponse.error) {
    console.error('[AdminProfile] getProfileDetail profile error', profileResponse.error)
    return null
  }

  const profileRow = profileResponse.data as (AdminUserRow & { last_active_at?: string | null }) | null
  if (!profileRow) return null

  const metadataRow = (metadataResponse.data ?? null) as MetadataRow | null
  const preferencesRow = (preferencesResponse.data ?? null) as PreferencesRow | null
  const rolesRows = (rolesResponse.data ?? []) as UserRoleRow[]
  const activityRows = (activityResponse.data ?? []) as AuditLogRow[]
  const lastActiveAt =
    activityRows.length > 0
      ? activityRows[0]?.created_at ?? null
      : profileRow['updated_at'] ?? profileRow['created_at'] ?? null

  const summary = mapSummary(profileRow, lastActiveAt)

  const metadata: ProfileMetadataDetail = {
    fullName: summary.fullName,
    avatarUrl: metadataRow?.avatar_url ?? summary.avatarUrl,
    avatarThumbnailUrl: metadataRow?.avatar_thumbnail_url ?? null,
    coverImageUrl: metadataRow?.cover_image_url ?? null,
    interests: metadataRow?.interests ?? [],
    tags: metadataRow?.tags ?? [],
    socialProfiles: toRecord(metadataRow?.social_profiles ?? null),
  }

  const preferences: ProfilePreferencesDetail = {
    countryCode: preferencesRow?.country_code ?? summary.countryCode,
    locale: preferencesRow?.locale ?? summary.locale,
    timezone: preferencesRow?.timezone ?? summary.timezone,
    updatedAt: preferencesRow?.['updated_at'] as string | null,
    preferences:
      (preferencesRow?.preferences as Record<string, unknown> | null | undefined) ?? {},
  }

  const roles = rolesRows.map<ProfileRoleSummary>((role) => ({
    id: role['id'] ?? '',
    role: role.role ?? 'guest',
    salonId: role['salon_id'],
    isActive: role['is_active'] ?? false,
    permissions: role.permissions ?? [],
    createdAt: role['created_at'],
  }))

  const activity = activityRows.map<ProfileActivityEntry>((log, index) => ({
    id: log['id'] ?? `audit-${index}`,
    createdAt: log['created_at'],
    eventType: log.action,
    action: log.action,
    entityType: log.entity_type,
    entityId: log.entity_id,
    isSuccess: log.is_success ?? null,
    severity: null,
    ipAddress: Array.isArray(log.ip_address)
      ? (log.ip_address.find((value) => typeof value === 'string') as string | null) ?? null
      : (log.ip_address as string | null),
    userAgent: log.user_agent,
  }))

  return {
    summary,
    metadata,
    preferences,
    roles,
    activity,
  }
}
