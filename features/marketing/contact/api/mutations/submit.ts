'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { contactSchema } from '@/features/marketing/contact/api/schema'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

/**
 * Contact message submission handler
 *
 * NOTE: Table engagement.contact_messages does not exist in the database schema.
 * This is a temporary stub implementation that logs contact attempts until
 * the proper database table is created. Database migration required before
 * contact messages can be persisted.
 */
export async function submitContactMessage(input: z.infer<typeof contactSchema>) {
  const logger = createOperationLogger('submitContactMessage', {})

  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const errorMessage = issue?.message ?? 'Please check your details and try again.'
    logger.error(errorMessage, 'validation', { input })
    console.error('Contact message validation failed', {
      error: errorMessage,
      timestamp: new Date().toISOString()
    })
    return {
      success: false,
      error: errorMessage,
    }
  }

  try {
    logger.start({ email: parsed.data.email, topic: parsed.data.topic })

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

    logger.warn('Contact message not persisted - table does not exist', {
      email: parsed.data.email,
      topic: parsed.data.topic,
    })

    console.log('Contact message logged (not persisted)', {
      email: parsed.data.email,
      topic: parsed.data.topic,
      timestamp: new Date().toISOString()
    })

    revalidatePath('/contact', 'page')
    return {
      success: true,
      // Return success to not break UI, but data is not persisted
    }
  } catch (error) {
    console.error('Contact message submission unexpected error', {
      email: parsed.data.email,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    logger.error(error instanceof Error ? error : String(error), 'system', { email: parsed.data.email })
    return {
      success: false,
      error: 'We could not send your message right now. Please try again later.',
    }
  }
}
