'use server'

import { createClient } from '@/lib/supabase/server'
import { ENV } from '@/lib/config/env'
import { createOperationLogger } from '@/lib/observability'
import { passwordResetRequestSchema } from '../schema'
import type { PasswordResetRequestResult } from '../types'

export async function requestPasswordReset(
  formData: FormData
): Promise<PasswordResetRequestResult> {
  const logger = createOperationLogger('requestPasswordReset', {})

  try {
    const rawData = {
      email: formData.get('email'),
    }

    const validation = passwordResetRequestSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      logger.error(firstError?.message ?? 'Invalid email', 'validation', { email: rawData.email })
      return { success: false, error: firstError?.message ?? 'Invalid email' }
    }

    const { email } = validation.data

    logger.start({ email })

    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${ENV.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    if (error) {
      logger.error(error, 'auth', { email })
      return { success: false, error: error.message }
    }

    logger.success({ email })
    return {
      success: true,
      message: 'Password reset link sent to your email',
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
