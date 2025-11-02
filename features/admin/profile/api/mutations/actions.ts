'use server'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { basicDetailsSchema, metadataSchema, preferencesSchema } from '../queries/schemas'
import type { Json } from '@/lib/types/database.types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

export interface ActionResponse {
  success: boolean
  message: string
}

const success = (message: string): ActionResponse => ({ success: true, message })
const failure = (message: string): ActionResponse => ({ success: false, message })

export async function updateProfileBasicsAction(payload: unknown): Promise<ActionResponse> {
  const logger = createOperationLogger('updateProfileBasicsAction', {})
  logger.start()

  const parsed = basicDetailsSchema.safeParse(payload)
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? 'Invalid profile details')
  }

  const { profileId, fullName, username } = parsed.data

  const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  if (username !== undefined) {
    const normalizedUsername = username === '' ? null : username
    const { error: usernameError } = await supabase
      .schema('identity')
      .from('profiles')
      .update({
        username: normalizedUsername,
        updated_by_id: session.user['id'],
      })
      .eq('id', profileId)

    if (usernameError) {
      console.error('[AdminProfile] Failed to update username', usernameError)
      return failure(usernameError.message)
    }
  }

  if (fullName !== undefined) {
    const normalizedFullName = fullName?.trim() ? fullName.trim() : null
    const { error: metadataError } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .upsert(
        {
          profile_id: profileId,
          full_name: normalizedFullName,
        },
        { onConflict: 'profile_id' },
      )

    if (metadataError) {
      console.error('[AdminProfile] Failed to update full name', metadataError)
      return failure(metadataError.message)
    }
  }

  revalidatePath('/admin/profile', 'page')
  return success('Profile details updated')
}

export async function updateProfileMetadataAction(payload: unknown): Promise<ActionResponse> {
  const parsed = metadataSchema.safeParse(payload)
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? 'Invalid metadata payload')
  }

  const { profileId, tags, interests, socialProfiles } = parsed.data

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .schema('identity')
    .from('profiles_metadata')
    .upsert(
      {
        profile_id: profileId,
        tags: tags?.length ? tags : null,
        interests: interests?.length ? interests : null,
        social_profiles: socialProfiles && Object.keys(socialProfiles).length > 0 ? socialProfiles : null,
      },
      { onConflict: 'profile_id' },
    )

  if (error) {
    console.error('[AdminProfile] Failed to update metadata', error)
    return failure(error.message)
  }

  revalidatePath('/admin/profile', 'page')
  return success('Profile metadata updated')
}

export async function updateProfilePreferencesAction(payload: unknown): Promise<ActionResponse> {
  const parsed = preferencesSchema.safeParse(payload)
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? 'Invalid preferences payload')
  }

  const { profileId, timezone, locale, countryCode, marketingEmails, smsAlerts } = parsed.data

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()

  const { data: existing, error: fetchError } = await supabase
    .schema('identity')
    .from('profiles_preferences')
    .select('preferences')
    .eq('profile_id', profileId)
    .maybeSingle()

  if (fetchError) {
    console.error('[AdminProfile] Failed to load existing preferences', fetchError)
    return failure(fetchError.message)
  }

  const existingPreferences =
    (existing?.['preferences'] as Record<string, Json> | null | undefined) ?? {}
  const nextPreferences: Record<string, Json> = { ...existingPreferences }

  if (marketingEmails !== undefined) {
    nextPreferences['marketingEmails'] = marketingEmails
  }

  if (smsAlerts !== undefined) {
    nextPreferences['smsAlerts'] = smsAlerts
  }

  const { error } = await supabase
    .schema('identity')
    .from('profiles_preferences')
    .upsert(
      {
        profile_id: profileId,
        timezone: timezone?.trim() ? timezone.trim() : null,
        locale: locale?.trim() ? locale.trim() : null,
        country_code: countryCode?.trim() ? countryCode.trim().toUpperCase() : null,
        preferences: Object.keys(nextPreferences).length > 0 ? nextPreferences : null,
      },
      { onConflict: 'profile_id' },
    )

  if (error) {
    console.error('[AdminProfile] Failed to update preferences', error)
    return failure(error.message)
  }

  revalidatePath('/admin/profile', 'page')
  return success('Preferences updated')
}

export async function anonymizeProfileAction(profileId: string): Promise<ActionResponse> {
  if (!profileId) {
    return failure('Invalid profile identifier')
  }

  const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient()
  const timestamp = new Date().toISOString()
  const anonymizedUsername = `anon_${profileId.slice(0, 8)}`

  const { error: profileError } = await supabase
    .schema('identity')
    .from('profiles')
    .update({
      username: anonymizedUsername,
      deleted_at: timestamp,
      deleted_by_id: session.user.id,
      updated_at: timestamp,
      updated_by_id: session.user.id,
    })
    .eq('id', profileId)

  if (profileError) {
    console.error('[AdminProfile] Failed to anonymize profile base record', profileError)
    return failure(profileError.message)
  }

  const { error: metadataError } = await supabase
    .schema('identity')
    .from('profiles_metadata')
    .update({
      full_name: 'Anonymized User',
      avatar_url: null,
      avatar_thumbnail_url: null,
      cover_image_url: null,
      interests: [],
      tags: [],
      social_profiles: null,
      updated_at: timestamp,
      updated_by_id: session.user.id,
    })
    .eq('profile_id', profileId)

  if (metadataError) {
    console.error('[AdminProfile] Failed to anonymize profile metadata', metadataError)
    return failure(metadataError.message)
  }

  const { error: preferencesError } = await supabase
    .schema('identity')
    .from('profiles_preferences')
    .update({
      country_code: null,
      locale: null,
      timezone: null,
      currency_code: null,
      preferences: {},
      updated_at: timestamp,
      updated_by_id: session.user.id,
    })
    .eq('profile_id', profileId)

  if (preferencesError) {
    console.error('[AdminProfile] Failed to anonymize profile preferences', preferencesError)
    return failure(preferencesError.message)
  }

  await supabase.schema('audit').from('audit_logs').insert({
    event_type: 'profile_anonymized',
    event_category: 'identity',
    severity: 'warning',
    user_id: session.user.id,
    action: 'anonymize_profile',
    entity_type: 'profile',
    entity_id: profileId,
    target_schema: 'identity',
    target_table: 'profiles',
    metadata: {
      anonymized_profile_id: profileId,
      anonymized_by: session.user.id,
    },
    is_success: true,
  })

  revalidatePath('/admin/profile', 'page')
  return success('User profile anonymized')
}
