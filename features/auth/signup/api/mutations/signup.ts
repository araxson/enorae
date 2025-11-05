'use server'

import { createClient } from '@/lib/supabase/server'
import { signupSchema } from '../schema'
import type { SignupResult } from '../types'
import { createOperationLogger, logAuthEvent } from '@/lib/observability'
import { rateLimit, getClientIdentifier, createRateLimitKey } from '@/lib/utils/rate-limit'

export async function signup(prevState: SignupResult | null, formData: FormData): Promise<SignupResult> {
  const emailValue = formData.get('email')
  const email = typeof emailValue === 'string' ? emailValue : ''

  const logger = createOperationLogger('signup', { email })
  logger.start()

  try {
    // SECURITY: Rate limiting to prevent automated account creation and abuse
    const ip = await getClientIdentifier()
    const rateLimitKey = createRateLimitKey('signup', ip)
    const rateLimitResult = await rateLimit({
      identifier: rateLimitKey,
      limit: 3, // 3 signup attempts
      windowMs: 3600000, // per 1 hour
    })

    if (!rateLimitResult.success) {
      logger.warn('Signup rate limit exceeded', { ip, email })
      logAuthEvent('auth_rate_limited', {
        operationName: 'signup',
        email,
        ip,
        success: false,
        reason: 'rate_limit_exceeded',
      })
      return {
        success: false,
        error: rateLimitResult.error || 'Too many signup attempts. Please try again later.',
        errors: { _form: [rateLimitResult.error || 'Too many signup attempts. Please try again later.'] },
      }
    }

    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
      full_name: formData.get('fullName'),
    }

    const validation = signupSchema.safeParse(rawData)
    if (!validation.success) {
      logger.error('Validation failed', 'validation', { email })
      return {
        success: false,
        error: 'Validation failed',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    const { email: validatedEmail, password, full_name } = validation.data

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email: validatedEmail,
      password,
      options: {
        emailRedirectTo: `${process.env['NEXT_PUBLIC_SITE_URL']}/auth/callback`,
        data: {
          full_name: full_name || null,
          email_verified: false,
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
      return {
        success: false,
        error: 'Unable to create account. Please try again or contact support.',
        errors: { _form: ['Unable to create account. Please try again or contact support.'] },
      }
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
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
      errors: { _form: ['An unexpected error occurred. Please try again.'] },
    }
  }
}
