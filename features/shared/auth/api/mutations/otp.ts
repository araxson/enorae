'use server'

import { createClient } from '@/lib/supabase/server'
import { otpSchema, passwordResetRequestSchema } from '../../schema'
import type { VerifyOtpResult, ResendOtpResult } from '../types'

export async function verifyOTP(formData: FormData): Promise<VerifyOtpResult> {
  const email = formData.get('email') as string
  console.log('OTP verification started', { email, timestamp: new Date().toISOString() })

  try {
    const rawData = {
      email,
      token: formData.get('token') as string,
    }

    const validation = otpSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      console.error('OTP verification validation failed', {
        email,
        error: firstError?.message ?? 'Invalid input'
      })
      return { error: firstError?.message ?? 'Invalid input' }
    }

    const { email: validatedEmail, token } = validation.data

    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      email: validatedEmail,
      token,
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

export async function resendOTP(formData: FormData): Promise<ResendOtpResult> {
  try {
    const rawData = {
      email: formData.get('email') as string,
    }

    const validation = passwordResetRequestSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return { error: firstError?.message ?? 'Invalid email' }
    }

    const { email } = validation.data

    const supabase = await createClient()

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      return { error: error.message }
    }

    return {
      success: true,
      message: 'OTP resent successfully',
    }
  } catch (error) {
    console.error('OTP resend error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
