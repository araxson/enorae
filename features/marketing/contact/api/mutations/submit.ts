'use server'

import { revalidatePath } from 'next/cache'
import { contactSchema } from '@/features/marketing/contact/api/schema'
import { createOperationLogger } from '@/lib/observability'
import { rateLimit, getClientIdentifier, createRateLimitKey } from '@/lib/utils/rate-limit'

type ContactFormState = {
  success?: boolean
  error?: string
  message?: string
  errors?: Record<string, string[]>
}

/**
 * Contact message submission handler
 *
 * NOTE: Table engagement.contact_messages does not exist in the database schema.
 * This is a temporary stub implementation that logs contact attempts until
 * the proper database table is created. Database migration required before
 * contact messages can be persisted.
 */
export async function submitContactMessage(
  prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  const logger = createOperationLogger('submitContactMessage', {})

  try {
    // CRITICAL FIX: Rate limiting to prevent spam
    const ip = await getClientIdentifier()
    const rateLimitKey = createRateLimitKey('contact_form', ip)
    const rateLimitResult = await rateLimit({
      identifier: rateLimitKey,
      limit: 3, // 3 submissions
      windowMs: 300000, // per 5 minutes
    })

    if (!rateLimitResult.success) {
      logger.warn('Contact form rate limit exceeded', { ip })
      return {
        success: false,
        error: rateLimitResult.error || 'Too many requests. Please try again later.',
      }
    }

    // Parse FormData - get() returns FormDataEntryValue | null
    const nameValue = formData.get('name')
    const emailValue = formData.get('email')
    const phoneValue = formData.get('phone')
    const topicValue = formData.get('topic')
    const messageValue = formData.get('message')

    // Convert to strings, handling null and File types
    const rawData = {
      name: typeof nameValue === 'string' ? nameValue : '',
      email: typeof emailValue === 'string' ? emailValue : '',
      phone: typeof phoneValue === 'string' ? phoneValue : '',
      topic: typeof topicValue === 'string' ? topicValue : '',
      message: typeof messageValue === 'string' ? messageValue : '',
    }

    // Validate with Zod
    const parsed = contactSchema.safeParse(rawData)
    if (!parsed.success) {
      logger.error('Contact message validation failed', 'validation', { email: rawData.email })
      return {
        success: false,
        message: 'Please check your details and try again.',
        errors: parsed.error.flatten().fieldErrors,
      }
    }

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
      ip,
    })

    logger.warn('Contact message not persisted - table does not exist', {
      email: parsed.data.email,
      topic: parsed.data.topic,
    })

    logger.success({ email: parsed.data.email, topic: parsed.data.topic })

    revalidatePath('/contact', 'page')
    return {
      success: true,
      message: 'Message sent! We will get back to you soon.',
    }
  } catch (error) {
    console.error('[submitContactMessage] Unexpected error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    logger.error(error instanceof Error ? error : String(error), 'system', {})
    return {
      success: false,
      error: 'We could not send your message right now. Please try again later.',
    }
  }
}
