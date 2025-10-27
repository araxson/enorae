'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

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
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

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

export async function uploadAvatar(formData: FormData): Promise<ActionResponse<{ url: string }>> {
  try {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const file = formData.get('avatar') as File
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 5MB' }
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        upsert: true,
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath)

    // Update profile metadata
    await updateProfileMetadata({
      avatar_url: publicUrl,
      avatar_thumbnail_url: publicUrl, // In production, generate thumbnail
    })

    return { success: true, data: { url: publicUrl } }
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload avatar',
    }
  }
}

export async function uploadCoverImage(formData: FormData): Promise<ActionResponse<{ url: string }>> {
  try {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const file = formData.get('cover') as File
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' }
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 10MB' }
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `covers/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        upsert: true,
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath)

    // Update profile metadata
    await updateProfileMetadata({
      cover_image_url: publicUrl,
    })

    return { success: true, data: { url: publicUrl } }
  } catch (error) {
    console.error('Error uploading cover image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload cover image',
    }
  }
}
