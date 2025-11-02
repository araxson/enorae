'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createOperationLogger } from '@/lib/observability'
import type { PasswordResetResult } from './types'

const newPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export async function resetPassword(
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
      const firstError = validation.error.issues[0]
      logger.error(firstError?.message ?? 'Invalid password', 'validation')
      return { error: firstError?.message ?? 'Invalid password' }
    }

    const { password } = validation.data

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // SECURITY: Verify user is authenticated during password reset
    if (authError || !user) {
      logger.error('User not authenticated during password reset', 'auth')
      return { error: 'Authentication required. Please use the password reset link from your email.' }
    }

    logger.start({ userId: user.id })

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      logger.error(error, 'auth', { userId: user.id })
      return { error: error.message }
    }

    logger.success({ userId: user.id })
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
