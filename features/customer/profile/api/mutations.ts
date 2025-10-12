'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

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

  revalidatePath('/customer/profile')
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

  revalidatePath('/customer/profile')
  return { success: true }
}

export async function updateProfilePreferences(formData: FormData) {
  const session = await requireAuth()
  const supabase = await createClient()

  const timezone = formData.get('timezone')?.toString()
  const locale = formData.get('locale')?.toString()
  const currencyCode = formData.get('currency_code')?.toString()
  const preferencesJson = formData.get('preferences')?.toString()

  const preferences = preferencesJson ? JSON.parse(preferencesJson) : {}

  const { error } = await supabase
    .schema('identity')
    .from('profiles_preferences')
    .upsert({
      profile_id: session.user.id,
      timezone: timezone || null,
      locale: locale || null,
      currency_code: currencyCode || null,
      preferences: preferences,
      updated_at: new Date().toISOString(),
    })

  if (error) throw error

  revalidatePath('/customer/settings/preferences')
  return { success: true }
}
