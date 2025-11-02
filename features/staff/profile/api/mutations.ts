'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import { STRING_LIMITS } from '@/lib/config/constants'

const updateStaffInfoSchema = z.object({
  title: z.string().max(100).optional().nullable(),
  bio: z.string().max(STRING_LIMITS.BIO).optional().nullable(),
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

    revalidatePath('/staff/profile', 'page')
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

    revalidatePath('/staff/profile', 'page')
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
 *
 * DISABLED: Feature requires 'staff-portfolios' storage bucket which doesn't exist
 *
 * TODO: To enable this feature, choose one of:
 * 1. Create 'staff-portfolios' bucket in Supabase dashboard with RLS policies
 * 2. Create organization.staff_portfolio_images table for database storage
 * 3. Extend organization.salon_media table to support staff portfolio images
 *
 * See: docs/gaps/01-business-portal-gaps.md (Issue #2) for implementation options
 *
 * @deprecated Disabled until storage infrastructure is created
 */
export async function uploadPortfolioImage(
  formData: FormData
): Promise<ActionResponse<string>> {
  return {
    success: false,
    error:
      'Portfolio upload feature is currently disabled. Please contact support for portfolio image management.',
  }
}
