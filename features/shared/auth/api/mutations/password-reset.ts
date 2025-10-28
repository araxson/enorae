'use server'

import { createClient } from '@/lib/supabase/server'
import { ENV } from '@/lib/config/env'
import {
  passwordResetRequestSchema,
  passwordResetSchema,
} from '../../schema'
import type {
  PasswordResetRequestResult,
  PasswordResetResult,
} from '../types'

export async function requestPasswordReset(
  formData: FormData
): Promise<PasswordResetRequestResult> {
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

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${ENV.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    if (error) {
      return { error: error.message }
    }

    return {
      success: true,
      message: 'Password reset link sent to your email',
    }
  } catch (error) {
    console.error('Password reset request error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function resetPassword(
  formData: FormData
): Promise<PasswordResetResult> {
  try {
    const rawData = {
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    const validation = passwordResetSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return { error: firstError?.message ?? 'Invalid password' }
    }

    const { password } = validation.data

    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Password reset error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
