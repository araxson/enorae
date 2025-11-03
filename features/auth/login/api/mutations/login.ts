'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { loginSchema } from '../schema'
import type { LoginResult } from '../types'
import { createOperationLogger, logAuthEvent } from '@/lib/observability'

export async function login(formData: FormData): Promise<LoginResult> {
  const email = formData.get('email') as string
  const logger = createOperationLogger('login', { email })
  logger.start()

  try {
    const rawData = {
      email,
      password: formData.get('password') as string,
    }

    const validation = loginSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      const errorMessage = firstError?.message ?? 'Invalid input'
      logger.error(errorMessage, 'validation', { email })
      return { success: false, error: errorMessage }
    }

    const { email: validatedEmail, password } = validation.data

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedEmail,
      password,
    })

    if (error) {
      logAuthEvent('auth_failure', {
        operationName: 'login',
        email: validatedEmail,
        reason: error.message,
        success: false,
      })
      logger.error(error.message, 'auth', { email: validatedEmail })
      // SECURITY: Use generic error message to prevent user enumeration attacks
      return { success: false, error: 'Invalid email or password' }
    }

    logAuthEvent('login', {
      operationName: 'login',
      userId: data.user?.id,
      email: validatedEmail,
      success: true,
    })
    logger.success({ userId: data.user?.id, email: validatedEmail })

    redirect('/dashboard')
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { email })
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
