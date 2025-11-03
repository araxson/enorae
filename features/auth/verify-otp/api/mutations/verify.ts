'use server'

import { createClient } from '@/lib/supabase/server'
import { otpSchema } from '../schema'
import type { VerifyOtpResult } from '../types'
import { createOperationLogger, logAuthEvent } from '@/lib/observability'

export async function verifyOTP(formData: FormData): Promise<VerifyOtpResult> {
  const email = formData.get('email') as string

  const logger = createOperationLogger('verifyOTP', { email })
  logger.start()

  try {
    const otpCode = formData.get('token') as string

    const validation = otpSchema.safeParse({
      email,
      token: otpCode,
    })
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      logger.error(firstError?.message ?? 'Invalid input', 'validation', { email })
      return { success: false, error: firstError?.message ?? 'Invalid input' }
    }

    const { email: validatedEmail, token: validatedToken } = validation.data

    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      email: validatedEmail,
      token: validatedToken,
      type: 'email',
    })

    if (error) {
      logAuthEvent('auth_failure', {
        operationName: 'verifyOTP',
        email: validatedEmail,
        reason: error.message,
        success: false,
      })
      logger.error(error.message, 'auth', { email: validatedEmail })
      return { success: false, error: error.message }
    }

    logAuthEvent('login', {
      operationName: 'verifyOTP',
      userId: data.user?.id,
      email: validatedEmail,
      success: true,
    })
    logger.success({ userId: data.user?.id, email: validatedEmail })

    return { success: true }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { email })
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
