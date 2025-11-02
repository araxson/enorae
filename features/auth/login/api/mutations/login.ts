'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { loginSchema } from '../schema'
import type { LoginResult } from './types'
import { createOperationLogger } from '@/lib/observability'

export async function login(formData: FormData): Promise<LoginResult> {
  const logger = createOperationLogger('login', {})
  logger.start()

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
      // SECURITY: Use generic error message to prevent user enumeration attacks
      return { error: 'Invalid email or password' }
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
