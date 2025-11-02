'use server'

import { createClient } from '@/lib/supabase/server'
import { otpSchema } from '../schema'
import type { VerifyOtpResult } from './types'
import { createOperationLogger } from '@/lib/observability'

export async function verifyOTP(formData: FormData): Promise<VerifyOtpResult> {
  const logger = createOperationLogger('verifyOTP', {})
  logger.start()

  const email = formData.get('email') as string
  console.log('OTP verification started', { email, timestamp: new Date().toISOString() })

  try {
    const otpCode = formData.get('token') as string

    const validation = otpSchema.safeParse({
      email,
      token: otpCode,
    })
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      console.error('OTP verification validation failed', {
        email,
        error: firstError?.message ?? 'Invalid input'
      })
      return { error: firstError?.message ?? 'Invalid input' }
    }

    const { email: validatedEmail, token: validatedToken } = validation.data

    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      email: validatedEmail,
      token: validatedToken,
      type: 'email',
    })

    if (error) {
      console.error('OTP verification failed', {
        email: validatedEmail,
        errorCode: error.code,
        error: error.message
      })
      return { error: error.message }
    }

    console.log('OTP verification successful', {
      email: validatedEmail,
      userId: data.user?.id,
      timestamp: new Date().toISOString()
    })

    return { success: true }
  } catch (error) {
    console.error('OTP verification unexpected error', {
      email,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
