'use server'

import { revalidatePath } from 'next/cache'
import { requireAuthSafe } from '@/lib/auth/guards'
import { uploadAvatar as uploadAvatarLib, uploadCoverImage as uploadCoverImageLib } from '@/lib/storage'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

import type { Json } from '@/lib/types/database.types'

export interface ProfileMetadataInput {
  full_name?: string | null
  avatar_url?: string | null
  avatar_thumbnail_url?: string | null
  cover_image_url?: string | null
  social_profiles?: Json | null
  interests?: string[] | null
  tags?: string[] | null
}

export async function updateProfileMetadata(
  input: ProfileMetadataInput
): Promise<ActionResponse> {
  try {
    const authResult = await requireAuthSafe()
    if (!authResult.success) {
      return { success: false, error: authResult.error }
    }
    const { user, supabase } = authResult

    // Upsert metadata (insert or update)
    const { error } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .upsert({
        profile_id: user.id,
        ...input,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error

    revalidatePath('/customer/profile', 'page')
    revalidatePath('/staff/profile', 'page')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error updating profile metadata:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile metadata',
    }
  }
}

// SECURITY: Allowed avatar file types and size limits
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_AVATAR_SIZE = 5 * 1024 * 1024 // 5MB

export async function uploadAvatarAction(formData: FormData): Promise<ActionResponse<{ url: string }>> {
  try {
    const authResult = await requireAuthSafe()
    if (!authResult.success) {
      return { success: false, error: authResult.error }
    }
    const { user } = authResult

    const file = formData.get('avatar') as File
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // SECURITY: Validate file type
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_AVATAR_TYPES.join(', ')}`,
      }
    }

    // SECURITY: Validate file size
    if (file.size > MAX_AVATAR_SIZE) {
      return {
        success: false,
        error: `File too large. Maximum size: ${MAX_AVATAR_SIZE / 1024 / 1024}MB`,
      }
    }

    const result = await uploadAvatarLib(file, user.id)
    if (!result.url) {
      return { success: false, error: result.error || 'Upload failed' }
    }

    // Update profile metadata
    await updateProfileMetadata({
      avatar_url: result.url,
      avatar_thumbnail_url: result.url, // In production, generate thumbnail
    })

    return { success: true, data: { url: result.url } }
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload avatar',
    }
  }
}

// SECURITY: Allowed cover image file types and size limits
const ALLOWED_COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_COVER_SIZE = 10 * 1024 * 1024 // 10MB

export async function uploadCoverImageAction(formData: FormData): Promise<ActionResponse<{ url: string }>> {
  try {
    const authResult = await requireAuthSafe()
    if (!authResult.success) {
      return { success: false, error: authResult.error }
    }
    const { user } = authResult

    const file = formData.get('cover') as File
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // SECURITY: Validate file type
    if (!ALLOWED_COVER_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_COVER_TYPES.join(', ')}`,
      }
    }

    // SECURITY: Validate file size
    if (file.size > MAX_COVER_SIZE) {
      return {
        success: false,
        error: `File too large. Maximum size: ${MAX_COVER_SIZE / 1024 / 1024}MB`,
      }
    }

    const result = await uploadCoverImageLib(file, user.id, 'salon')
    if (!result.url) {
      return { success: false, error: result.error || 'Upload failed' }
    }

    // Update profile metadata
    await updateProfileMetadata({
      cover_image_url: result.url,
    })

    return { success: true, data: { url: result.url } }
  } catch (error) {
    console.error('Error uploading cover image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload cover image',
    }
  }
}

