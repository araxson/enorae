'use server'

import { createClient } from '@/lib/supabase/server'
import { signupSchema } from '../schema'
import type { SignupResult } from './types'
import { createOperationLogger } from '@/lib/observability'

export async function signup(formData: FormData): Promise<SignupResult> {
  const logger = createOperationLogger('signup', {})
  logger.start()

  const emailValue = formData.get('email')
  const email = typeof emailValue === 'string' ? emailValue : ''
  console.log('Signup attempt started', { email, timestamp: new Date().toISOString() })

  try {
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
      full_name: formData.get('fullName'),
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

    const { email: validatedEmail, password, full_name } = validation.data

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email: validatedEmail,
      password,
      options: {
        data: {
          full_name: full_name || null,
        },
      },
    })

    if (error) {
      console.error('Signup creation failed', {
        email: validatedEmail,
        errorCode: error.code,
        error: error.message
      })
      // SECURITY: Use generic error message to prevent user enumeration attacks
      // Don't reveal if email already exists or other specific error details
      return { error: 'Unable to create account. Please try again or contact support.' }
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
