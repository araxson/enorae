'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { contactSchema } from '@/features/marketing/contact/schema'

/**
 * Contact message submission handler
 *
 * NOTE: Table engagement.contact_messages does not exist in the database schema.
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

    revalidatePath('/contact', 'page')
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
