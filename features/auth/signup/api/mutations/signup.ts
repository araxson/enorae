'use server'

import { createClient } from '@/lib/supabase/server'
import { signupSchema } from '../schema'
import type { SignupResult } from '../types'
import { createOperationLogger, logAuthEvent } from '@/lib/observability'

export async function signup(formData: FormData): Promise<SignupResult> {
  const emailValue = formData.get('email')
  const email = typeof emailValue === 'string' ? emailValue : ''

  const logger = createOperationLogger('signup', { email })
  logger.start()

  try {
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
      full_name: formData.get('fullName'),
    }

    const validation = signupSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      logger.error(firstError?.message ?? 'Invalid input', 'validation', { email })
      return { success: false, error: firstError?.message ?? 'Invalid input' }
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
      logAuthEvent('auth_failure', {
        operationName: 'signup',
        email: validatedEmail,
        reason: error.message,
        success: false,
      })
      logger.error(error.message, 'auth', { email: validatedEmail })
      // SECURITY: Use generic error message to prevent user enumeration attacks
      // Don't reveal if email already exists or other specific error details
      return { success: false, error: 'Unable to create account. Please try again or contact support.' }
    }

    logAuthEvent('login', {
      operationName: 'signup',
      userId: data.user?.id,
      email: validatedEmail,
      success: true,
    })
    logger.success({ userId: data.user?.id, email: validatedEmail })

    return {
      success: true,
      message: 'Check your email to confirm your account',
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { email })
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
