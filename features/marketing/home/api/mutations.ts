'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { PostgrestError } from '@supabase/supabase-js'

const DEFAULT_NEWSLETTER_SOURCE = 'marketing_site'

type MarketingNewsletterSubscriptionInsert = {
  email: string
  source: string | null
}

type MarketingContactMessageInsert = {
  name: string
  email: string
  phone: string | null
  topic: string | null
  message: string
}

interface InsertCommand<T> {
  insert(values: T): Promise<{ error: PostgrestError | null }>
}

const newsletterSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  source: z.string().optional(),
})

export async function subscribeToNewsletter(input: z.infer<typeof newsletterSchema>) {
  const parsed = newsletterSchema.safeParse(input)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || 'Invalid email address'
    return { success: false, error: message }
  }

  try {
    const supabase = await createClient()

    const newsletterRecord = {
      email: parsed.data.email,
      source: parsed.data.source ?? DEFAULT_NEWSLETTER_SOURCE,
    } satisfies MarketingNewsletterSubscriptionInsert

    const newsletterInsert = supabase
      .from('marketing_newsletter_subscriptions') as unknown as InsertCommand<MarketingNewsletterSubscriptionInsert>

    const { error } = await newsletterInsert.insert(newsletterRecord)

    if (error) {
      console.error('[subscribeToNewsletter] insert error:', error)
      const message = error.code === '23505'
        ? 'You are already subscribed with this email address.'
        : 'We could not subscribe you right now. Please try again later.'
      return {
        success: false,
        error: message,
      }
    }

    return { success: true }
  } catch (error) {
    console.error('[subscribeToNewsletter] unexpected error:', error)
    return {
      success: false,
      error: 'We could not subscribe you right now. Please try again later.',
    }
  }
}

const contactSchema = z.object({
  name: z.string().min(2, 'Please provide your name'),
  email: z.string().email('Please provide a valid email address'),
  phone: z.string().min(5).max(50).optional(),
  topic: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
})

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
    const supabase = await createClient()

    const contactRecord = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      topic: parsed.data.topic ?? null,
      message: parsed.data.message,
    } satisfies MarketingContactMessageInsert

    const contactInsert = supabase
      .from('marketing_contact_messages') as unknown as InsertCommand<MarketingContactMessageInsert>

    const { error } = await contactInsert.insert(contactRecord)

    if (error) {
      console.error('[submitContactMessage] insert error:', error)
      return {
        success: false,
        error: 'We could not send your message right now. Please try again later.',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('[submitContactMessage] unexpected error:', error)
    return {
      success: false,
      error: 'We could not send your message right now. Please try again later.',
    }
  }
}
