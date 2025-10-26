'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const updateStaffInfoSchema = z.object({
  title: z.string().max(100).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  experienceYears: z.number().int().min(0).max(100).optional().nullable(),
})

const updateStaffMetadataSchema = z.object({
  specialties: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
})

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function updateStaffInfo(formData: FormData): Promise<ActionResponse> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    // Get staff profile ID using user_id
    // The staff view includes sp.id from organization.staff_profiles
    const { data: staffProfile, error: profileError } = await supabase
      .from('staff_profiles_view')
      .select('id')
      .eq('user_id', session.user.id)
      .single<{ id: string }>()

    if (profileError || !staffProfile) {
      return { success: false, error: 'Staff profile not found. Please contact support.' }
    }

    // Validate input
    const result = updateStaffInfoSchema.safeParse({
      title: formData.get('title')?.toString() || null,
      bio: formData.get('bio')?.toString() || null,
      experienceYears: formData.get('experienceYears')
        ? parseInt(formData.get('experienceYears')!.toString(), 10)
        : null,
    })

    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Validation failed' }
    }

    const { title, bio, experienceYears } = result.data

    // Update staff_profiles table using the ID from the staff view
    // The staff view's id field maps to staff_profiles.id
    const { error: updateError } = await supabase
      .schema('organization')
      .from('staff_profiles')
      .update({
        title: title || null,
        bio: bio || null,
        experience_years: experienceYears ?? null,
        updated_at: new Date().toISOString(),
        updated_by_id: session.user.id,
      })
      .eq('id', staffProfile.id)

    if (updateError) {
      console.error('Error updating staff profile:', updateError)
      throw updateError
    }

    revalidatePath('/staff/profile')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error updating staff info:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update staff information',
    }
  }
}

/**
 * Update staff metadata (specialties, certifications, interests)
 */
export async function updateStaffMetadata(
  data: z.infer<typeof updateStaffMetadataSchema>
): Promise<ActionResponse> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    const validation = updateStaffMetadataSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message || 'Validation failed' }
    }

    const { specialties, certifications, interests } = validation.data

    // Get profile_id from user_id
    const { data: profile } = await supabase
      .from('profiles_view')
      .select('id')
      .eq('user_id', session.user.id)
      .single<{ id: string }>()

    if (!profile?.id) {
      return { success: false, error: 'Profile not found' }
    }

    // Update or create metadata
    const { error } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .upsert({
        profile_id: profile.id,
        interests: interests || [],
        tags: [...(specialties || []), ...(certifications || [])],
        updated_at: new Date().toISOString(),
      })

    if (error) throw error

    revalidatePath('/staff/profile')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error updating staff metadata:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update metadata',
    }
  }
}

/**
 * Upload portfolio image for staff
 */
export async function uploadPortfolioImage(formData: FormData): Promise<ActionResponse<string>> {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    const file = formData.get('image') as File
    if (!file) {
      return { success: false, error: 'No image provided' }
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Use JPEG, PNG, or WebP' }
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File too large. Maximum size is 5MB' }
    }

    // Get staff profile
    const { data: staff } = await supabase
      .from('staff_profiles_view')
      .select('id, salon_id')
      .eq('user_id', session.user.id)
      .single<{ id: string; salon_id: string }>()

    if (!staff?.id) {
      return { success: false, error: 'Staff profile not found' }
    }

    // Upload to storage
    const fileName = `${staff.id}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('staff-portfolios')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('staff-portfolios')
      .getPublicUrl(fileName)

    // Note: salon_media table only supports logo_url, cover_image_url, and gallery_urls
    // Portfolio images are stored only in the storage bucket for now
    // A future enhancement would require adding a separate portfolio_images table or extending salon_media

    revalidatePath('/staff/profile')
    return { success: true, data: publicUrl }
  } catch (error) {
    console.error('Error uploading portfolio image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    }
  }
}
