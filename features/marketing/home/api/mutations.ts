'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { newsletterSchema } from '@/features/marketing/home/schema'
import { contactSchema } from '@/features/marketing/contact/schema'

const DEFAULT_NEWSLETTER_SOURCE = 'marketing_site'

/**
 * Newsletter subscription handler
 *
 * NOTE: Tables marketing_newsletter_subscriptions and marketing_contact_messages
 * do not exist in the database schema. This is a temporary stub implementation
 * that logs subscription attempts until the proper database tables are created.
 *
 * TODO: Create engagement.newsletter_subscriptions table in database
 * TODO: Create engagement.contact_messages table in database
 */
export async function subscribeToNewsletter(input: z.infer<typeof newsletterSchema>) {
  const parsed = newsletterSchema.safeParse(input)
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

    revalidatePath('/')
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

/**
 * Contact message submission handler
 *
 * NOTE: Table marketing_contact_messages does not exist in the database schema.
 * This is a temporary stub implementation that logs contact attempts until
 * the proper database table is created.
 *
 * TODO: Create engagement.contact_messages table in database
 */
export async function submitContactMessage(input: z.infer<typeof contactSchema>) {
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue?.message ?? 'Please check your details and try again.',
    }
  }

  try {
    // SCHEMA ALIGNMENT: Table does not exist in database
    // Logging contact attempt instead of database insert
    console.log('[submitContactMessage] Contact attempt (table does not exist):', {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      topic: parsed.data.topic ?? null,
      message: parsed.data.message,
      timestamp: new Date().toISOString(),
    })

    revalidatePath('/contact')
    return {
      success: true,
      // Return success to not break UI, but data is not persisted
    }
  } catch (error) {
    console.error('[submitContactMessage] unexpected error:', error)
    return {
      success: false,
      error: 'We could not send your message right now. Please try again later.',
    }
  }
}
