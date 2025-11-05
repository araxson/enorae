'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAuthSafe } from '@/lib/auth/guards'
import { profileUpdateSchema } from './schema'
import { createOperationLogger, logError } from '@/lib/observability'

type FormState = {
  message?: string
  errors?: Record<string, string[]>
  success?: boolean
}

/**
 * Server Action for updating user profile
 * Validates input with Zod and handles profile metadata updates
 */
export async function updateProfileAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const logger = createOperationLogger('updateProfileAction', {})
  logger.start()

  try {
    // SECURITY: Require authenticated user
    const authResult = await requireAuthSafe()
    if (!authResult.success) {
      return {
        message: authResult.error,
        success: false,
      }
    }
    const { user, supabase } = authResult

    // Parse and validate form data
    const parsed = profileUpdateSchema.safeParse({
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string | null,
      bio: formData.get('bio') as string | null,
      timezone: formData.get('timezone') as string | undefined,
      locale: formData.get('locale') as string | undefined,
    })

    if (!parsed.success) {
      return {
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
        success: false,
      }
    }

    // Get old profile data for change tracking (optional, for audit purposes)
    const { data: oldProfile } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .select('full_name, phone, bio, timezone, locale')
      .eq('profile_id', user.id)
      .single()

    // Prepare update payload
    const updatePayload = {
      profile_id: user.id,
      updated_at: new Date().toISOString(),
      ...(parsed.data.full_name !== undefined && { full_name: parsed.data.full_name || null }),
      ...(parsed.data.phone !== undefined && { phone: parsed.data.phone || null }),
      ...(parsed.data.bio !== undefined && { bio: parsed.data.bio || null }),
      ...(parsed.data.timezone !== undefined && { timezone: parsed.data.timezone }),
      ...(parsed.data.locale !== undefined && { locale: parsed.data.locale }),
    }

    // Upsert profile metadata (insert or update)
    const { error } = await supabase
      .schema('identity')
      .from('profiles_metadata')
      .upsert(updatePayload)

    if (error) throw error

    // Revalidate profile pages across portals
    revalidatePath('/customer/profile', 'page')
    revalidatePath('/staff/profile', 'page')
    revalidatePath('/business/profile', 'page')

    logger.success()

    return {
      message: 'Profile updated successfully',
      success: true,
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')

    logError('Failed to update profile', {
      operationName: 'updateProfileAction',
      error: error instanceof Error ? error.message : String(error),
      errorCategory: 'database',
    })

    return {
      message: error instanceof Error ? error.message : 'Failed to update profile',
      success: false,
    }
  }
}
