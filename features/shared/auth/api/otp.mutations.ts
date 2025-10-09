'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'

import type { ResendOtpResult, VerifyOtpResult } from './types'

type VerifyOtpParams = {
  email: string
  token: string
  type: 'email' | 'recovery'
}

type ResendOtpParams = {
  email: string
  type: 'signup' | 'recovery'
}

export async function verifyOTP(formData: FormData): Promise<VerifyOtpResult> {
  try {
    const supabase = await createClient()
    const params: VerifyOtpParams = {
      email: (formData.get('email') as string) ?? '',
      token: (formData.get('token') as string) ?? '',
      type: ((formData.get('type') as string) || 'email') as VerifyOtpParams['type'],
    }

    if (!params.email || !params.token) {
      return { error: 'Email and verification code are required' }
    }

    const { error } = await supabase.auth.verifyOtp({
      email: params.email,
      token: params.token,
      type: params.type,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('OTP verification error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function resendOTP(formData: FormData): Promise<ResendOtpResult> {
  try {
    const supabase = await createClient()
    const params: ResendOtpParams = {
      email: (formData.get('email') as string) ?? '',
      type: ((formData.get('type') as string) || 'signup') as ResendOtpParams['type'],
    }

    if (!params.email) {
      return { error: 'Email is required' }
    }

    if (params.type === 'signup') {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: params.email,
      })

      if (error) {
        return { error: error.message }
      }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(params.email, {
        redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
      })

      if (error) {
        return { error: error.message }
      }
    }

    return { success: true, message: 'Verification code resent' }
  } catch (error) {
    console.error('Resend OTP error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
