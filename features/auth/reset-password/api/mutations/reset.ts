'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createOperationLogger } from '@/lib/observability'
import type { PasswordResetResult } from '../types'

const newPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export async function resetPassword(
  prevState: PasswordResetResult | null,
  formData: FormData
): Promise<PasswordResetResult> {
  const logger = createOperationLogger('resetPassword', {})

  try {
    const rawData = {
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    }

    const validation = newPasswordSchema.safeParse(rawData)
    if (!validation.success) {
      logger.error('Validation failed', 'validation')
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        errors: validation.error.flatten().fieldErrors
      }
    }

    const { password } = validation.data

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // SECURITY: Verify user is authenticated during password reset
    if (authError || !user) {
      logger.error('User not authenticated during password reset', 'auth')
      return { success: false, error: 'Authentication required. Please use the password reset link from your email.' }
    }

    logger.start({ userId: user.id })

    // SECURITY: Password reset via email link doesn't require nonce
    // The email link token itself serves as authentication proof
    // However, for extra security, we verify the user is authenticated via the link
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      logger.error(error, 'auth', { userId: user.id })
      // SECURITY: Use generic error message to prevent information disclosure
      return { success: false, error: 'Failed to reset password. Please request a new reset link.' }
    }

    logger.success({ userId: user.id })
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
