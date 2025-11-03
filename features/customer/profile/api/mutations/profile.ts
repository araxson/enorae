'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'
import { getOptionalString, getOptionalJsonObject } from '@/lib/utils/safe-form-data'

export async function updateProfileMetadata(formData: FormData) {
  const logger = createOperationLogger('updateProfileMetadata', {})

  try {
    const session = await requireAuth()
    logger.start({ userId: session.user.id })
    const supabase = await createClient()

    const interests = getOptionalString(formData, 'interests')
    const tags = getOptionalString(formData, 'tags')

    // Parse comma-separated values into arrays
    const interestsArray = interests ? interests.split(',').map(i => i.trim()).filter(Boolean) : []
    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []

    const { error } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .upsert({
        profile_id: session.user.id,
        interests: interestsArray,
        tags: tagsArray,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      logger.error(error, 'database')
      throw error
    }

    revalidatePath('/customer/profile', 'page')

    logger.success({ interestsCount: interestsArray.length, tagsCount: tagsArray.length })
    return { success: true }
  } catch (error: unknown) {
    logger.error(error instanceof Error ? error : new Error(String(error)), 'system')
    throw error
  }
}

export async function updateProfileAvatar(avatarUrl: string) {
  const logger = createOperationLogger('updateProfileAvatar', {})

  try {
    const session = await requireAuth()
    logger.start({ userId: session.user.id })
    const supabase = await createClient()

    const { error } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .upsert({
        profile_id: session.user.id,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      logger.error(error, 'database', { userId: session.user.id })
      throw error
    }

    revalidatePath('/customer/profile', 'page')

    logger.success({ userId: session.user.id })
    return { success: true }
  } catch (error: unknown) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    throw error
  }
}

export async function updateProfilePreferences(formData: FormData) {
  const logger = createOperationLogger('updateProfilePreferences', {})

  try {
    const session = await requireAuth()
    const supabase = await createClient()

    logger.start({ userId: session.user.id })

    const timezone = getOptionalString(formData, 'timezone')
    const locale = getOptionalString(formData, 'locale')
    const currencyCode = getOptionalString(formData, 'currency_code')
    const preferencesJson = getOptionalString(formData, 'preferences')

    const preferences = preferencesJson
      ? getOptionalJsonObject<Record<string, unknown>>(formData, 'preferences', {})
      : {}

    // Cast preferences to Json type for database
    const preferencesForDb = preferences as Json

    const { error } = await supabase
      .schema('identity')
      .from('profiles_preferences')
      .upsert({
        profile_id: session.user.id,
        timezone: timezone ?? null,
        locale: locale ?? null,
        currency_code: currencyCode ?? null,
        preferences: preferencesForDb,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      logger.error(error, 'database', { userId: session.user.id })
      throw error
    }

    revalidatePath('/customer/settings/preferences', 'page')

    logger.success({ userId: session.user.id, timezone, locale, currencyCode })
    return { success: true }
  } catch (error: unknown) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    throw error
  }
}
