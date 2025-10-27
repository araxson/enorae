'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/lib/types/database.types'

export async function updateProfileMetadata(formData: FormData) {
  const session = await requireAuth()
  const supabase = await createClient()

  const interests = formData.get('interests')?.toString()
  const tags = formData.get('tags')?.toString()

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

  if (error) throw error

  revalidatePath('/customer/profile', 'page')
  return { success: true }
}

export async function updateProfileAvatar(avatarUrl: string) {
  const session = await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase
    .schema('identity')
    .from('profiles_metadata')
    .upsert({
      profile_id: session.user.id,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })

  if (error) throw error

  revalidatePath('/customer/profile', 'page')
  return { success: true }
}

export async function updateProfilePreferences(formData: FormData) {
  const session = await requireAuth()
  const supabase = await createClient()

  const timezone = formData.get('timezone')?.toString()
  const locale = formData.get('locale')?.toString()
  const currencyCode = formData.get('currency_code')?.toString()
  const preferencesJson = formData.get('preferences')?.toString()

  let preferences: Record<string, unknown> = {}
  if (preferencesJson) {
    try {
      const parsed = JSON.parse(preferencesJson)
      preferences = typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed : {}
    } catch {
      return { error: 'Invalid preferences format' }
    }
  }

  // Cast preferences to Json type for database storage
  const preferencesForDb = preferences as unknown as Json

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

  if (error) throw error

  revalidatePath('/customer/settings/preferences', 'page')
  return { success: true }
}
