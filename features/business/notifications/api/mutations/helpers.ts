'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const notificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.string(),
  channels: z.array(z.string()).optional(),
  data: z.record(z.string(), z.unknown()).optional()
})

export const notificationIdsSchema = z.array(z.string().uuid()).optional()

export async function getSupabaseClient() {
  return await createClient()
}

export async function ensureRecipientAuthorized(recipientId: string, currentUserId: string) {
  // Basic authorization - can be extended
  return recipientId === currentUserId
}

export async function validateNotificationData(data: Record<string, unknown>) {
  return true
}

export async function sendNotificationEmail(to: string, subject: string, body: string) {
  // Placeholder for email sending logic
  return { success: true }
}

export async function logNotificationActivity(userId: string, action: string, metadata?: Record<string, unknown>) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Log the activity
  return { success: true }
}

export function revalidateNotifications() {
  revalidatePath('/business/notifications', 'page')
  revalidatePath('/staff/notifications', 'page')
  revalidatePath('/customer/notifications', 'page')
}
