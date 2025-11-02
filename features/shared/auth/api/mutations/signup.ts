'use server'

import { createClient } from '@/lib/supabase/server'
import { signupSchema } from '../schema'
import type { SignupResult } from '../types'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

export async function signup(formData: FormData): Promise<SignupResult> {
  const logger = createOperationLogger('signup', {})
  logger.start()

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
