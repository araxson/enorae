'use server'

import { createClient } from '@/lib/supabase/server'
import { ENV } from '@/lib/config/env'
import { createOperationLogger, logAuthEvent } from '@/lib/observability'
import { passwordResetRequestSchema } from '../schema'
import type { PasswordResetRequestResult } from '../types'
import { rateLimit, getClientIdentifier, createRateLimitKey } from '@/lib/utils/rate-limit'

export async function requestPasswordReset(
  prevState: unknown,
  formData: FormData
): Promise<PasswordResetRequestResult> {
  const logger = createOperationLogger('requestPasswordReset', {})

  try {
    const rawData = {
      email: formData.get('email'),
    }

    const validation = passwordResetRequestSchema.safeParse(rawData)
    if (!validation.success) {
      logger.error('Validation failed', 'validation', { email: rawData.email })
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: validation.error.flatten().fieldErrors
      }
    }

    const { email } = validation.data

    // SECURITY: Rate limiting to prevent abuse and email enumeration attacks
    const ip = await getClientIdentifier()
    const rateLimitKey = createRateLimitKey('password_reset', ip)
    const rateLimitResult = await rateLimit({
      identifier: rateLimitKey,
      limit: 3, // 3 reset requests
      windowMs: 3600000, // per 1 hour
    })

    if (!rateLimitResult.success) {
      logger.warn('Password reset rate limit exceeded', { ip, email })
      logAuthEvent('auth_rate_limited', {
        operationName: 'password_reset',
        email,
        ip,
        success: false,
        reason: 'rate_limit_exceeded',
      })
      return {
        success: false,
        error: rateLimitResult.error || 'Too many password reset requests. Please try again later.',
      }
    }

    logger.start({ email })

    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${ENV.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    // SECURITY: Always return success to prevent email enumeration
    // Don't reveal whether the email exists or not
    if (error) {
      logger.error(error, 'auth', { email })
      // Still return success message - same as successful case
    } else {
      logger.success({ email })
    }

    // SECURITY: Generic message that doesn't reveal if email exists
    return {
      success: true,
      message: 'If an account exists with that email, you will receive a password reset link.',
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
