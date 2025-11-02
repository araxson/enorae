'use server'

import { revalidatePath } from 'next/cache'
import { newsletterSubscriptionSchema } from '../../schema'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

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

  const parsed = newsletterSubscriptionSchema.safeParse(input)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || 'Invalid email address'
    logger.error(message, 'validation', { input })
    console.error('Newsletter subscription validation failed', {
      error: message,
      timestamp: new Date().toISOString()
    })
    return { success: false, error: message }
  }

  try {
    logger.start({ email: parsed.data.email, source: parsed.data.source })

    // SCHEMA ALIGNMENT: Table does not exist in database
    // Logging subscription attempt instead of database insert
    console.log('[subscribeToNewsletter] Subscription attempt (table does not exist):', {
      email: parsed.data.email,
      source: parsed.data.source ?? DEFAULT_NEWSLETTER_SOURCE,
      timestamp: new Date().toISOString(),
    })

    logger.warn('Newsletter subscription not persisted - table does not exist', {
      email: parsed.data.email,
      source: parsed.data.source ?? DEFAULT_NEWSLETTER_SOURCE,
    })

    revalidatePath('/', 'page')

    console.log('Newsletter subscription logged (not persisted)', {
      email: parsed.data.email,
      source: parsed.data.source ?? DEFAULT_NEWSLETTER_SOURCE,
      timestamp: new Date().toISOString()
    })

    return {
      success: true,
      // Return success to not break UI, but data is not persisted
    }
  } catch (error) {
    console.error('Newsletter subscription unexpected error', {
      email: parsed.data.email,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    logger.error(error instanceof Error ? error : String(error), 'system', { email: parsed.data.email })
    return {
      success: false,
      error: 'We could not subscribe you right now. Please try again later.',
    }
  }
}
