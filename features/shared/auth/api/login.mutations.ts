'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { DEFAULT_ROUTES, type RoleType } from '@/lib/auth/permissions'
import { loginSchema, signupSchema } from '@/lib/validations/auth'

import type { LoginResult, SignupResult } from './types'

export async function login(formData: FormData): Promise<LoginResult> {
  let redirectTo: string | null = null

  try {
    const supabase = await createClient()
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const validation = loginSchema.safeParse(rawData)

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors
      return {
        error: errors.email?.[0] || errors.password?.[0] || 'Validation failed',
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword(validation.data)

    if (error) {
      if (error.message.includes('Email not confirmed') || error.message.includes('not verified')) {
        return {
          error: 'Please verify your email address first',
          requiresOTP: true,
          email: validation.data.email,
        }
      }
      return { error: error.message }
    }

    if (data.user && !data.user.email_confirmed_at) {
      return {
        error: 'Please verify your email address to continue',
        requiresOTP: true,
        email: validation.data.email,
      }
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Authentication failed' }
    }

    const roleQuery = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle<{ role: RoleType | null }>()

    const role = roleQuery.data?.role ?? null
    const defaultPortalRoute = role ? DEFAULT_ROUTES[role] ?? '/customer' : '/customer'
    redirectTo = defaultPortalRoute

    const redirectParam = formData.get('redirectTo') as string | null
    if (redirectParam && redirectParam.startsWith('/')) {
      redirectTo = redirectParam
    }

    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }

  if (redirectTo) {
    redirect(redirectTo)
  }

  return {}
}

export async function signup(formData: FormData): Promise<SignupResult> {
  try {
    const supabase = await createClient()
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
        error:
          errors.email?.[0] ||
          errors.password?.[0] ||
          errors.confirmPassword?.[0] ||
          errors.fullName?.[0] ||
          'Validation failed',
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email: validation.data.email,
      password: validation.data.password,
      options: {
        data: {
          full_name: validation.data.fullName,
        },
        emailRedirectTo: undefined,
      },
    })

    if (error) {
      return { error: error.message }
    }

    if (data?.user) {
      return {
        success: true,
        requiresOTP: true,
        email: validation.data.email,
        message: 'Account created! Please verify your email with the code we sent you.',
      }
    }

    return { error: 'Failed to create account. Please try again.' }
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function logout(): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Logout error:', error)
  }

  redirect('/login')
}
