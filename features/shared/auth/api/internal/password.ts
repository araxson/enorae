'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'

import type { PasswordResetRequestResult, PasswordResetResult } from './types'

export async function requestPasswordReset(formData: FormData): Promise<PasswordResetRequestResult> {
  try {
    const supabase = await createClient()
    const email = formData.get('email') as string

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: 'Please enter a valid email address' }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true, message: 'Password reset link sent to your email' }
  } catch (error) {
    console.error('Password reset request error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function resetPassword(formData: FormData): Promise<PasswordResetResult> {
  let shouldRedirect = false

  try {
    const supabase = await createClient()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      return { error: 'Passwords do not match' }
    }

    if (password.length < 8) {
      return { error: 'Password must be at least 8 characters' }
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      return { error: error.message }
    }

    shouldRedirect = true
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Password reset error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }

  if (shouldRedirect) {
    redirect('/login')
  }

  return {}
}
