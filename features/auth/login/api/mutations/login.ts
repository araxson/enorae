'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { loginSchema } from '../schema'
import type { LoginResult } from '../types'
import { createOperationLogger, logAuthEvent } from '@/lib/observability'
import { rateLimit, getClientIdentifier, createRateLimitKey } from '@/lib/utils/rate-limit'

type LoginFormState = {
  success?: boolean
  error?: string
  errors?: Record<string, string[]>
  requiresOTP?: boolean
  email?: string
}

export async function login(
  prevState: LoginFormState | null,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get('email') as string
  const logger = createOperationLogger('login', { email })
  logger.start()

  try {
    // CRITICAL FIX: Rate limiting to prevent brute force attacks
    const ip = await getClientIdentifier()
    const rateLimitKey = createRateLimitKey('login', ip)
    const rateLimitResult = await rateLimit({
      identifier: rateLimitKey,
      limit: 5, // 5 login attempts
      windowMs: 900000, // per 15 minutes
    })

    if (!rateLimitResult.success) {
      logger.warn('Login rate limit exceeded', { ip, email })
      logAuthEvent('auth_rate_limited', {
        operationName: 'login',
        email,
        ip,
        success: false,
        reason: 'rate_limit_exceeded',
      })
      return {
        success: false,
        error: rateLimitResult.error || 'Too many login attempts. Please try again later.',
      }
    }

    // Parse FormData
    const rawData = {
      email,
      password: formData.get('password') as string,
    }

    // Validate with Zod
    const validation = loginSchema.safeParse(rawData)
    if (!validation.success) {
      logger.error('Login validation failed', 'validation', { email })
      return {
        success: false,
        error: 'Please check your details and try again.',
        errors: validation.error.flatten().fieldErrors,
      }
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

    revalidatePath('/', 'layout') // Clear all cached data after login
    redirect('/dashboard')
  } catch (error) {
    // Handle redirect (expected behavior)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    logger.error(error instanceof Error ? error : String(error), 'system', { email })
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
