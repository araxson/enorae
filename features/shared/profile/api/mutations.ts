'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
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
      return { success: false, error: result.error.errors[0].message }
    }

    const { username } = result.data

    // Check if username is already taken
    const { data: existing } = await supabase
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

    revalidatePath('/customer/profile')
    revalidatePath('/staff/profile')
    revalidatePath('/business/profile')

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Error updating username:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update username',
    }
  }
}
