'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, signupSchema } from '@/lib/validations/auth'
import type { Database } from '@/lib/types/database.types'

type UserRole = Database['public']['Views']['user_roles']['Row']

export async function login(formData: FormData) {
  let redirectTo: string | null = null

  try {
    const supabase = await createClient()

    // Validate input
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const validation = loginSchema.safeParse(rawData)

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors
      return {
        error: errors.email?.[0] || errors.password?.[0] || 'Validation failed'
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword(validation.data)

    if (error) {
      // IMPROVED: Check if error is due to unverified email
      if (error.message.includes('Email not confirmed') || error.message.includes('not verified')) {
        return {
          error: 'Please verify your email address first',
          requiresOTP: true,
          email: validation.data.email,
        }
      }
      return { error: error.message }
    }

    // Check if email is confirmed (additional safety check)
    if (data.user && !data.user.email_confirmed_at) {
      return {
        error: 'Please verify your email address to continue',
        requiresOTP: true,
        email: validation.data.email,
      }
    }

    // Get user role to redirect to appropriate portal
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Authentication failed' }
    }

    // Fetch user role from database
    const roleQuery = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    const userData = roleQuery.data as UserRole | null

    // Determine redirect based on role
    redirectTo = '/customer/salons' // Better default for logged in users

    if (!roleQuery.error && userData?.role) {
      const role = String(userData.role)
      const roleMap: Record<string, string> = {
        'super_admin': '/admin',
        'platform_admin': '/admin',
        'tenant_owner': '/business/dashboard',
        'salon_owner': '/business/dashboard',
        'salon_manager': '/business/dashboard',
        'senior_staff': '/staff',
        'staff': '/staff',
        'junior_staff': '/staff',
        'vip_customer': '/customer/salons',
        'customer': '/customer/salons',
        'guest': '/explore',
      }
      redirectTo = roleMap[role] || '/customer/salons'
    }

    // If we have a redirect query param from login page, use that instead
    const redirectParam = formData.get('redirect') as string
    if (redirectParam && redirectParam.startsWith('/')) {
      redirectTo = redirectParam
    }

    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }

  // Redirect OUTSIDE try-catch to prevent catching NEXT_REDIRECT error
  if (redirectTo) {
    redirect(redirectTo)
  }
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient()

    // Validate input
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      fullName: formData.get('fullName') as string,
    }

    const validation = signupSchema.safeParse(rawData)

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors
      return {
        error: errors.email?.[0] || errors.password?.[0] || errors.confirmPassword?.[0] || errors.fullName?.[0] || 'Validation failed'
      }
    }

    // IMPROVED: Use OTP verification instead of email confirmation link
    const { data, error } = await supabase.auth.signUp({
      email: validation.data.email,
      password: validation.data.password,
      options: {
        data: {
          full_name: validation.data.fullName,
        },
        emailRedirectTo: undefined, // Disable email confirmation link
      },
    })

    if (error) {
      return { error: error.message }
    }

    // Return success with email for OTP verification redirect
    if (data?.user) {
      return {
        success: true,
        requiresOTP: true,
        email: validation.data.email,
        message: 'Account created! Please verify your email with the code we sent you.'
      }
    }

    return { error: 'Failed to create account. Please try again.' }
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function logout() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Logout error:', error)
    // Continue to redirect even if logout fails
  }

  // Redirect OUTSIDE try-catch
  redirect('/login')
}

/**
 * Request password reset via email
 */
export async function requestPasswordReset(formData: FormData) {
  try {
    const supabase = await createClient()
    const email = formData.get('email') as string

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: 'Please enter a valid email address' }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
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

/**
 * Reset password with new password
 */
export async function resetPassword(formData: FormData) {
  let shouldRedirect = false

  try {
    const supabase = await createClient()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Validate passwords match
    if (password !== confirmPassword) {
      return { error: 'Passwords do not match' }
    }

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      return { error: 'Password must be at least 8 characters' }
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      return { error: error.message }
    }

    shouldRedirect = true
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Password reset error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }

  // Redirect OUTSIDE try-catch
  if (shouldRedirect) {
    redirect('/login')
  }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(formData: FormData) {
  try {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const token = formData.get('token') as string
    const type = (formData.get('type') as string) || 'email'

    if (!email || !token) {
      return { error: 'Email and verification code are required' }
    }

    // Verify OTP based on type
    if (type === 'recovery') {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
      })

      if (error) {
        return { error: error.message }
      }
    } else {
      // For signup verification
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      })

      if (error) {
        return { error: error.message }
      }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('OTP verification error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

/**
 * Resend OTP code
 */
export async function resendOTP(formData: FormData) {
  try {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const type = formData.get('type') as 'signup' | 'recovery'

    if (!email) {
      return { error: 'Email is required' }
    }

    if (type === 'signup') {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })

      if (error) {
        return { error: error.message }
      }
    } else {
      // For password recovery, send a new reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
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
