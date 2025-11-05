'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'

/**
 * Update profile information - Server Action
 */
export async function updateProfileAction(prevState: unknown, formData: FormData) {
  try {
    const session = await requireAuth()
    const supabase = await createClient()

    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string

    // Validation
    if (!fullName || fullName.trim().length === 0) {
      return {
        success: false,
        message: 'Full name is required',
        errors: {
          fullName: ['Full name is required'],
        },
      }
    }

    const { error } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .update({
        full_name: fullName.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('profile_id', session.user.id)

    if (error) {
      return {
        success: false,
        message: error.message || 'Failed to update profile',
      }
    }

    // Update phone in profiles_preferences if provided
    if (phone) {
      await supabase
        .schema('identity')
        .from('profiles_preferences')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('profile_id', session.user.id)
    }

    revalidatePath('/business/settings/account', 'page')

    return {
      success: true,
      message: 'Profile updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update profile',
    }
  }
}

/**
 * Update profile information
 * @deprecated Use updateProfileAction for form submissions
 */
export async function updateProfile(data: {
  full_name?: string
  phone?: string
  avatar_url?: string
}) {
  const session = await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase
    .schema('identity')
    .from('profiles_metadata')
    .update({
      full_name: data.full_name,
      updated_at: new Date().toISOString(),
    })
    .eq('profile_id', session.user.id)

  if (error) throw error

  // Update phone in profiles_preferences if provided
  if (data.phone !== undefined) {
    await supabase
      .schema('identity')
      .from('profiles_preferences')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('profile_id', session.user.id)
  }

  revalidatePath('/business/settings/account', 'page')
  return { success: true }
}
