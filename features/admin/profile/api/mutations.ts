'use server'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { basicDetailsSchema, metadataSchema, preferencesSchema } from './schemas'
import type { Json } from '@/lib/types/database.types'
import type { PostgrestError } from '@supabase/supabase-js'

export interface ActionResponse {
  success: boolean
  message: string
}

const success = (message: string): ActionResponse => ({ success: true, message })
const failure = (message: string): ActionResponse => ({ success: false, message })

export async function updateProfileBasicsAction(payload: unknown): Promise<ActionResponse> {
  const parsed = basicDetailsSchema.safeParse(payload)
  if (!parsed.success) {
    return failure(parsed.error.errors[0]?.message ?? 'Invalid profile details')
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
        updated_by_id: session.user.id,
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

  revalidatePath('/admin/profile')
  return success('Profile details updated')
}

export async function updateProfileMetadataAction(payload: unknown): Promise<ActionResponse> {
  const parsed = metadataSchema.safeParse(payload)
  if (!parsed.success) {
    return failure(parsed.error.errors[0]?.message ?? 'Invalid metadata payload')
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

  revalidatePath('/admin/profile')
  return success('Profile metadata updated')
}

export async function updateProfilePreferencesAction(payload: unknown): Promise<ActionResponse> {
  const parsed = preferencesSchema.safeParse(payload)
  if (!parsed.success) {
    return failure(parsed.error.errors[0]?.message ?? 'Invalid preferences payload')
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
    (existing?.preferences as Record<string, Json> | null | undefined) ?? {}
  const nextPreferences: Record<string, Json> = { ...existingPreferences }

  if (marketingEmails !== undefined) {
    nextPreferences.marketingEmails = marketingEmails
  }

  if (smsAlerts !== undefined) {
    nextPreferences.smsAlerts = smsAlerts
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

  revalidatePath('/admin/profile')
  return success('Preferences updated')
}

type IdentityAnonymizeUserArgs = { p_user_id: string }

type IdentityRpcClient = ReturnType<typeof createServiceRoleClient> & {
  rpc: (
    fn: 'identity.anonymize_user',
    args: IdentityAnonymizeUserArgs,
  ) => Promise<{ data: null; error: PostgrestError | null }>
}

export async function anonymizeProfileAction(profileId: string): Promise<ActionResponse> {
  if (!profileId) {
    return failure('Invalid profile identifier')
  }

  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
  const supabase = createServiceRoleClient() as IdentityRpcClient

  const { error } = await supabase.rpc('identity.anonymize_user', { p_user_id: profileId })

  if (error) {
    console.error('[AdminProfile] Failed to anonymize user', error)
    return failure(error.message)
  }

  revalidatePath('/admin/profile')
  return success('User successfully anonymized')
}
