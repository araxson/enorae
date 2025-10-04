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
      .from('staff')
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
      return { success: false, error: result.error.errors[0].message }
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
