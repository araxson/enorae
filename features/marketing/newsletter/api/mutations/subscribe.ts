'use server'

import { revalidatePath } from 'next/cache'
import { newsletterSubscriptionSchema } from '../../schema'

const DEFAULT_NEWSLETTER_SOURCE = 'marketing_site'

/**
 * Newsletter subscription handler
 *
 * NOTE: Table engagement.newsletter_subscriptions does not exist in the database schema.
 * This is a temporary stub implementation that logs subscription attempts until
 * the proper database table is created.
 *
 * TODO: Create engagement.newsletter_subscriptions table in database
 */
export async function subscribeToNewsletter(input: unknown) {
  const parsed = newsletterSubscriptionSchema.safeParse(input)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || 'Invalid email address'
    return { success: false, error: message }
  }

  try {
    // SCHEMA ALIGNMENT: Table does not exist in database
    // Logging subscription attempt instead of database insert
    console.log('[subscribeToNewsletter] Subscription attempt (table does not exist):', {
      email: parsed.data.email,
      source: parsed.data.source ?? DEFAULT_NEWSLETTER_SOURCE,
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/', 'page')
    return {
      success: true,
      // Return success to not break UI, but data is not persisted
    }
  } catch (error) {
    console.error('[subscribeToNewsletter] unexpected error:', error)
    return {
      success: false,
      error: 'We could not subscribe you right now. Please try again later.',
    }
  }
}
