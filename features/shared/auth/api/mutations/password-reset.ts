'use server'

import { createClient } from '@/lib/supabase/server'
import { ENV } from '@/lib/config/env'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'
import {
  passwordResetRequestSchema,
  passwordResetSchema,
} from '../schema'
import type {
  PasswordResetRequestResult,
  PasswordResetResult,
} from '../types'

export async function requestPasswordReset(
  formData: FormData
): Promise<PasswordResetRequestResult> {
  const logger = createOperationLogger('requestPasswordReset', {})

  try {
    const rawData = {
      email: formData.get('email') as string,
    }

    const validation = passwordResetRequestSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      logger.error(firstError?.message ?? 'Invalid email', 'validation', { email: rawData.email })
      return { error: firstError?.message ?? 'Invalid email' }
    }

    const { email } = validation.data

    logger.start({ email })

    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${ENV.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    if (error) {
      logger.error(error, 'auth', { email })
      return { error: error.message }
    }

    logger.success({ email })
    return {
      success: true,
      message: 'Password reset link sent to your email',
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function resetPassword(
  formData: FormData
): Promise<PasswordResetResult> {
  const logger = createOperationLogger('resetPassword', {})

  try {
    const rawData = {
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    const validation = passwordResetSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      logger.error(firstError?.message ?? 'Invalid password', 'validation')
      return { error: firstError?.message ?? 'Invalid password' }
    }

    const { password } = validation.data

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    logger.start({ userId: user?.id })

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      logger.error(error, 'auth', { userId: user?.id })
      return { error: error.message }
    }

    logger.success({ userId: user?.id })
    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
