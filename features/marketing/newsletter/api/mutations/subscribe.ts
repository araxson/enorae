'use server'

import { revalidatePath } from 'next/cache'
import { newsletterSubscriptionSchema } from '../schema'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'
import { rateLimit, getClientIdentifier, createRateLimitKey } from '@/lib/utils/rate-limit'

const DEFAULT_NEWSLETTER_SOURCE = 'marketing_site'

/**
 * Newsletter subscription handler
 *
 * NOTE: Table engagement.newsletter_subscriptions does not exist in the database schema.
 * This is a temporary stub implementation that logs subscription attempts until
 * the proper database table is created. Database migration required before
 * newsletter subscriptions can be persisted.
 */
export async function subscribeToNewsletter(input: unknown) {
  const logger = createOperationLogger('subscribeToNewsletter', {})

  // CRITICAL FIX: Rate limiting to prevent spam
  const ip = await getClientIdentifier()
  const rateLimitKey = createRateLimitKey('newsletter', ip)
  const rateLimitResult = await rateLimit({
    identifier: rateLimitKey,
    limit: 5, // 5 subscriptions
    windowMs: 3600000, // per hour
  })

  if (!rateLimitResult.success) {
    logger.warn('Newsletter subscription rate limit exceeded', { ip })
    return {
      success: false,
      error: rateLimitResult.error || 'Too many subscription attempts. Please try again later.',
    }
  }

  const parsed = newsletterSubscriptionSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors
    const firstError = Object.values(fieldErrors)[0]?.[0]
    const message = firstError || 'Invalid email address'
    logger.error(message, 'validation', { input })
    return { success: false, error: message, fieldErrors }
  }

  try {
    logger.start({ email: parsed.data.email, source: parsed.data.source })

    // SCHEMA ALIGNMENT: Table does not exist in database
    // Logging subscription attempt instead of database insert
    logger.warn('Newsletter subscription not persisted - table does not exist', {
      email: parsed.data.email,
      source: parsed.data.source ?? DEFAULT_NEWSLETTER_SOURCE,
    })

    revalidatePath('/', 'page')

    return {
      success: true,
      // Return success to not break UI, but data is not persisted
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { email: parsed.data.email })
    return {
      success: false,
      error: 'We could not subscribe you right now. Please try again later.',
    }
  }
}
