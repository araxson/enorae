'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, signupSchema } from '@/lib/validations/auth'

export async function login(formData: FormData) {
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

    const { error } = await supabase.auth.signInWithPassword(validation.data)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
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

    const { error } = await supabase.auth.signUp({
      email: validation.data.email,
      password: validation.data.password,
      options: {
        data: {
          full_name: validation.data.fullName,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
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
    redirect('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Still redirect to login even if logout fails
    redirect('/login')
  }
}
