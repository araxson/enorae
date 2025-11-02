'use server'

import { createClient } from '@/lib/supabase/server'
import { resendOtpSchema } from '../schema'
import type { ResendOtpResult } from './types'
import { createOperationLogger } from '@/lib/observability'

export async function resendOTP(formData: FormData): Promise<ResendOtpResult> {
  const logger = createOperationLogger('resendOTP', {})

  try {
    const rawData = {
      email: formData.get('email') as string,
    }

    const validation = resendOtpSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      console.error('OTP resend validation failed', {
        email: rawData.email,
        error: firstError?.message ?? 'Invalid email'
      })
      logger.error(firstError?.message ?? 'Invalid email', 'validation', { email: rawData.email })
      return { error: firstError?.message ?? 'Invalid email' }
    }

    const { email } = validation.data

    logger.start({ email })
    console.log('OTP resend started', { email, timestamp: new Date().toISOString() })

    const supabase = await createClient()

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      console.error('OTP resend failed', {
        email,
        errorCode: error.code,
        error: error.message
      })
      logger.error(error, 'auth', { email })
      return { error: error.message }
    }

    console.log('OTP resent successfully', {
      email,
      timestamp: new Date().toISOString()
    })
    logger.success({ email })

    return {
      success: true,
      message: 'OTP resent successfully',
    }
  } catch (error) {
    console.error('OTP resend unexpected error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    logger.error(error instanceof Error ? error : String(error), 'system')
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
