'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/lib/types/database.types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

export async function updateProfileMetadata(formData: FormData) {
  const logger = createOperationLogger('updateProfileMetadata', {})

  try {
    const session = await requireAuth()
    const supabase = await createClient()

    logger.start({ userId: session.user.id })

    const interests = formData.get('interests')?.toString()
    const tags = formData.get('tags')?.toString()

    // Parse comma-separated values into arrays
    const interestsArray = interests ? interests.split(',').map(i => i.trim()).filter(Boolean) : []
    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []

    console.log('Updating profile metadata', {
      userId: session.user.id,
      interestsCount: interestsArray.length,
      tagsCount: tagsArray.length,
      timestamp: new Date().toISOString()
    })

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
      logger.error(error, 'database', { userId: session.user.id })
      throw error
    }

    logMutation('update', 'profile_metadata', session.user.id, {
      userId: session.user.id,
      operationName: 'updateProfileMetadata',
      changes: { interestsCount: interestsArray.length, tagsCount: tagsArray.length },
    })

    revalidatePath('/customer/profile', 'page')

    logger.success({ userId: session.user.id, interestsCount: interestsArray.length, tagsCount: tagsArray.length })
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    throw error
  }
}

export async function updateProfileAvatar(avatarUrl: string) {
  const logger = createOperationLogger('updateProfileAvatar', {})

  try {
    const session = await requireAuth()
    const supabase = await createClient()

    logger.start({ userId: session.user.id })
    console.log('Updating profile avatar', {
      userId: session.user.id,
      timestamp: new Date().toISOString()
    })

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

    logMutation('update', 'profile_avatar', session.user.id, {
      userId: session.user.id,
      operationName: 'updateProfileAvatar',
    })

    revalidatePath('/customer/profile', 'page')

    logger.success({ userId: session.user.id })
    return { success: true }
  } catch (error) {
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

    const timezone = formData.get('timezone')?.toString()
    const locale = formData.get('locale')?.toString()
    const currencyCode = formData.get('currency_code')?.toString()
    const preferencesJson = formData.get('preferences')?.toString()

    let preferences: Record<string, unknown> = {}
    if (preferencesJson) {
      try {
        const parsed = JSON.parse(preferencesJson)
        preferences = typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed : {}
      } catch (error) {
        logger.error('Invalid preferences JSON format', 'validation', { userId: session.user.id })
        return { error: 'Invalid preferences format' }
      }
    }

    console.log('Updating profile preferences', {
      userId: session.user.id,
      timezone,
      locale,
      currencyCode,
      timestamp: new Date().toISOString()
    })

    // Convert to Json type for database - Json can be object, array, string, number, boolean, or null
    const preferencesForDb = JSON.parse(JSON.stringify(preferences)) as Json

    const { error } = await supabase
      .schema('identity')
      .from('profiles_preferences')
      .upsert({
        profile_id: session.user.id,
        timezone: timezone || null,
        locale: locale || null,
        currency_code: currencyCode || null,
        preferences: preferencesForDb,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      logger.error(error, 'database', { userId: session.user.id })
      throw error
    }

    logMutation('update', 'profile_preferences', session.user.id, {
      userId: session.user.id,
      operationName: 'updateProfilePreferences',
      changes: { timezone, locale, currencyCode },
    })

    revalidatePath('/customer/settings/preferences', 'page')

    logger.success({ userId: session.user.id, timezone, locale, currencyCode })
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    throw error
  }
}
