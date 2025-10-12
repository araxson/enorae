import 'server-only'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getUserSalonIds, requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

export type NotificationChannel =
  Database['public']['Enums']['notification_channel']
export type NotificationType =
  Database['public']['Enums']['notification_type']

export const notificationChannels = [
  'email',
  'sms',
  'push',
  'in_app',
  'whatsapp',
] as const

export const notificationEvents = [
  'appointment_confirmation',
  'appointment_reminder',
  'appointment_cancelled',
  'appointment_rescheduled',
  'promotion',
  'review_request',
  'loyalty_update',
  'staff_message',
  'system_alert',
  'welcome',
  'birthday',
  'other',
] as const

export const notificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(notificationEvents),
  channels: z.array(z.enum(notificationChannels)).optional(),
  data: z.record(z.unknown()).optional(),
})

export const notificationIdsSchema = z.array(z.string().uuid()).optional()

export async function getSupabaseClient() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  return createClient()
}

export function revalidateNotifications() {
  revalidatePath('/business/notifications')
}

export async function ensureRecipientAuthorized(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const accessibleSalonIds = await getUserSalonIds()
  if (!accessibleSalonIds.length) {
    throw new Error('Unauthorized: No accessible salons found')
  }

  const { data: staffMemberships, error: staffError } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', userId)
    .in('salon_id', accessibleSalonIds)
    .limit(1)

  if (staffError) throw staffError

  if (staffMemberships?.length) {
    return true
  }

  const { data: customerMemberships, error: customerError } = await supabase
    .from('appointments')
    .select('id')
    .eq('customer_id', userId)
    .in('salon_id', accessibleSalonIds)
    .limit(1)

  if (customerError) throw customerError

  if (!customerMemberships?.length) {
    throw new Error('Unauthorized recipient')
  }

  return true
}
