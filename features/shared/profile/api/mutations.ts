'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import { rateLimit, getClientIdentifier, createRateLimitKey } from '@/lib/utils/rate-limit'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

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
 * RATE LIMIT: 5 changes per day (prevents username squatting)
 */
export async function updateUsername(formData: FormData): Promise<ActionResponse> {
  try {
    // Rate limiting - 5 changes per day per IP
    const ip = await getClientIdentifier()
    const rateLimitKey = createRateLimitKey('username', ip)
    const rateLimitResult = await rateLimit({
      identifier: rateLimitKey,
      limit: 5,
      windowMs: 86400000, // 24 hours
    })

    if (!rateLimitResult.success) {
      return {
        success: false,
        error: rateLimitResult.error || 'Too many username changes. Try again later.',
      }
    }

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
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: result.error.flatten().fieldErrors
      }
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

    if (updateError) {
      console.error('Database error updating username:', updateError)
      return { success: false, error: 'Failed to update username. Please try again.' }
    }

    revalidatePath('/customer/profile', 'page')
    revalidatePath('/staff/profile', 'page')
    revalidatePath('/business/profile', 'page')

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error updating username:', error)
    return {
      success: false,
      error: 'Failed to update username. Please try again.',
    }
  }
}

/**
 * Upload user avatar
 * Available to all authenticated users
 * RATE LIMIT: 10 uploads per hour (prevents storage abuse and CSRF)
 */
export async function uploadAvatar(formData: FormData): Promise<ActionResponse<{ url: string }>> {
  try {
    // Rate limiting - 10 uploads per hour per IP
    const ip = await getClientIdentifier()
    const rateLimitKey = createRateLimitKey('avatar', ip)
    const rateLimitResult = await rateLimit({
      identifier: rateLimitKey,
      limit: 10,
      windowMs: 3600000, // 1 hour
    })

    if (!rateLimitResult.success) {
      return {
        success: false,
        error: rateLimitResult.error || 'Too many upload attempts. Try again later.',
      }
    }

    const session = await requireAuth()
    const supabase = await createClient()

    const file = formData.get('avatar')

    // SECURITY: Validate file is actually a File object
    if (!file || !(file instanceof File)) {
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

    if (uploadError) {
      console.error('Storage error uploading avatar:', uploadError)
      return { success: false, error: 'Failed to upload avatar. Please try again.' }
    }

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

    if (updateError) {
      console.error('Database error updating avatar metadata:', updateError)
      return { success: false, error: 'Failed to save avatar. Please try again.' }
    }

    revalidatePath('/customer/profile', 'page')
    revalidatePath('/staff/profile', 'page')
    revalidatePath('/business/profile', 'page')

    return { success: true, data: { url: publicUrl } }
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return {
      success: false,
      error: 'Failed to upload avatar. Please try again.',
    }
  }
}
