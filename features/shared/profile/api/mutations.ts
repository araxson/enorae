'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
})

/**
 * Update user's username
 * Available to all authenticated users
 */
export async function updateUsername(formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    const result = usernameSchema.safeParse({
      username: formData.get('username'),
    })

    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message ?? 'Validation failed' }
    }

    const { username } = result.data

    // Check if username is already taken
    const { data: existing } = await supabase
      .schema('identity')
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user.id)
      .single()

    if (existing) {
      return { success: false, error: 'Username is already taken' }
    }

    // Update username
    const { error: updateError } = await supabase
      .schema('identity')
      .from('profiles')
      .update({
        username,
        updated_at: new Date().toISOString(),
        updated_by_id: user.id,
      })
      .eq('id', user.id)

    if (updateError) throw updateError

    revalidatePath('/customer/profile', 'page')
    revalidatePath('/staff/profile', 'page')
    revalidatePath('/business/profile', 'page')

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error updating username:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update username',
    }
  }
}

/**
 * Upload user avatar
 * Available to all authenticated users
 */
export async function uploadAvatar(formData: FormData): Promise<ActionResponse<{ url: string }>> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    const file = formData.get('avatar') as File

    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' }
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 5MB' }
    }

    // Upload to storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${session.user.id}/${Date.now()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        upsert: true,
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(uploadData.path)

    // Update profile metadata with avatar URL
    const { error: updateError } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .upsert({
        profile_id: session.user.id,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })

    if (updateError) throw updateError

    revalidatePath('/customer/profile', 'page')
    revalidatePath('/staff/profile', 'page')
    revalidatePath('/business/profile', 'page')

    return { success: true, data: { url: publicUrl } }
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload avatar',
    }
  }
}
