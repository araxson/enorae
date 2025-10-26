'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ENV } from '@/lib/config/env'
import {
  loginSchema,
  signupSchema,
  otpSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
} from '../schema'
import type {
  LoginResult,
  SignupResult,
  VerifyOtpResult,
  ResendOtpResult,
  PasswordResetRequestResult,
  PasswordResetResult,
} from './types'

export async function login(formData: FormData): Promise<LoginResult> {
  const email = formData.get('email') as string
  console.log('Login attempt started', { email, timestamp: new Date().toISOString() })

  try {
    const rawData = {
      email,
      password: formData.get('password') as string,
    }

    const validation = loginSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      console.error('Login validation failed', {
        email,
        error: firstError?.message ?? 'Invalid input'
      })
      return { error: firstError?.message ?? 'Invalid input' }
    }

    const { email: validatedEmail, password } = validation.data

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedEmail,
      password,
    })

    if (error) {
      console.error('Login authentication failed', {
        email: validatedEmail,
        errorCode: error.code,
        error: error.message
      })
      return { error: error.message }
    }

    console.log('Login successful', {
      email: validatedEmail,
      userId: data.user?.id,
      timestamp: new Date().toISOString()
    })

    redirect('/dashboard')
  } catch (error) {
    console.error('Login unexpected error', {
      email,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function signup(formData: FormData): Promise<SignupResult> {
  const email = formData.get('email') as string
  console.log('Signup attempt started', { email, timestamp: new Date().toISOString() })

  try {
    const rawData = {
      email,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
    }

    const validation = signupSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      console.error('Signup validation failed', {
        email,
        error: firstError?.message ?? 'Invalid input'
      })
      return { error: firstError?.message ?? 'Invalid input' }
    }

    const { email: validatedEmail, password, fullName } = validation.data

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email: validatedEmail,
      password,
      options: {
        data: {
          full_name: fullName || null,
        },
      },
    })

    if (error) {
      console.error('Signup creation failed', {
        email: validatedEmail,
        errorCode: error.code,
        error: error.message
      })
      return { error: error.message }
    }

    console.log('Signup successful - confirmation email sent', {
      email: validatedEmail,
      userId: data.user?.id,
      timestamp: new Date().toISOString()
    })

    return {
      success: true,
      message: 'Check your email to confirm your account',
    }
  } catch (error) {
    console.error('Signup unexpected error', {
      email,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function logout(): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    console.log('Logout initiated', {
      userId: user?.id,
      email: user?.email,
      timestamp: new Date().toISOString()
    })

    await supabase.auth.signOut()

    console.log('Logout completed', {
      userId: user?.id,
      timestamp: new Date().toISOString()
    })

    redirect('/login')
  } catch (error) {
    console.error('Logout error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    redirect('/login')
  }
}

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

export type {
  LoginResult,
  SignupResult,
  VerifyOtpResult,
  ResendOtpResult,
  PasswordResetRequestResult,
  PasswordResetResult,
}
