'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import type { NotificationTemplate } from './queries'

type NotificationChannel = Database['public']['Enums']['notification_channel']
type NotificationType = Database['public']['Enums']['notification_type']

/**
 * Send a notification to a user
 */
const sendNotificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum([
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
  ]),
  channels: z
    .array(z.enum(['email', 'sms', 'push', 'in_app', 'whatsapp']))
    .optional(),
  data: z.record(z.unknown()).optional(),
})

export async function sendNotification(input: {
  userId: string
  title: string
  message: string
  type: NotificationType
  channels?: NotificationChannel[]
  data?: Record<string, unknown>
}) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const validation = sendNotificationSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const supabase = await createClient()
  const { userId, title, message, type, channels, data } = validation.data

  const { data: notificationId, error } = await supabase.rpc('send_notification', {
    p_user_id: userId,
    p_title: title,
    p_message: message,
    p_type: type,
    p_channels: channels,
    p_data: data,
  })

  if (error) throw error

  revalidatePath('/business/notifications')
  return { success: true, notificationId }
}

/**
 * Mark notifications as read
 */
const markNotificationsReadSchema = z.object({
  notificationIds: z.array(z.string().uuid()).optional(),
})

export async function markNotificationsRead(notificationIds?: string[]) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const validation = markNotificationsReadSchema.safeParse({ notificationIds })
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: count, error } = await supabase.rpc('mark_notifications_read', {
    p_user_id: user.id,
    p_notification_ids: notificationIds,
  })

  if (error) throw error

  revalidatePath('/business/notifications')
  return { success: true, markedCount: count }
}

/**
 * Update notification preferences
 * Note: This would need a notification_preferences table in the database
 */
const updatePreferencesSchema = z.object({
  preferences: z.object({
    email: z.record(z.boolean()).optional(),
    sms: z.record(z.boolean()).optional(),
    in_app: z.record(z.boolean()).optional(),
    push: z.record(z.boolean()).optional(),
  }),
})

export async function updateNotificationPreferences(preferences: {
  email?: Record<string, boolean>
  sms?: Record<string, boolean>
  in_app?: Record<string, boolean>
  push?: Record<string, boolean>
}) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const validation = updatePreferencesSchema.safeParse({ preferences })
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // TODO: Implement when notification_preferences table is created
  // For now, store in user metadata
  const { error } = await supabase.auth.updateUser({
    data: {
      notification_preferences: preferences,
    },
  })

  if (error) throw error

  revalidatePath('/business/notifications')
  return { success: true }
}

/**
 * Send appointment confirmation notification
 */
export async function sendAppointmentConfirmation(
  customerId: string,
  appointmentDetails: {
    id: string
    startTime: string
    serviceName: string
    staffName: string
  }
) {
  return sendNotification({
    userId: customerId,
    title: 'Appointment Confirmed',
    message: `Your appointment for ${appointmentDetails.serviceName} with ${appointmentDetails.staffName} is confirmed for ${new Date(appointmentDetails.startTime).toLocaleString()}.`,
    type: 'appointment_confirmation',
    channels: ['email', 'sms', 'in_app'],
    data: appointmentDetails,
  })
}

/**
 * Send appointment reminder notification
 */
export async function sendAppointmentReminder(
  customerId: string,
  appointmentDetails: {
    id: string
    startTime: string
    serviceName: string
    staffName: string
  }
) {
  return sendNotification({
    userId: customerId,
    title: 'Appointment Reminder',
    message: `Reminder: You have an appointment for ${appointmentDetails.serviceName} with ${appointmentDetails.staffName} tomorrow at ${new Date(appointmentDetails.startTime).toLocaleString()}.`,
    type: 'appointment_reminder',
    channels: ['email', 'sms', 'in_app', 'push'],
    data: appointmentDetails,
  })
}

/**
 * Send review request notification
 */
export async function sendReviewRequest(
  customerId: string,
  appointmentDetails: {
    id: string
    serviceName: string
    salonName: string
  }
) {
  return sendNotification({
    userId: customerId,
    title: 'How was your experience?',
    message: `We'd love to hear about your experience with ${appointmentDetails.serviceName} at ${appointmentDetails.salonName}!`,
    type: 'review_request',
    channels: ['email', 'in_app'],
    data: appointmentDetails,
  })
}

const notificationTemplateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  channel: z.enum(['email', 'sms', 'push', 'in_app', 'whatsapp']),
  event: z.enum([
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
  ]),
  subject: z.string().optional(),
  body: z.string().min(10),
})

export async function upsertNotificationTemplate(template: NotificationTemplate) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const validation = notificationTemplateSchema.safeParse(template)
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const currentTemplates = (user.user_metadata?.notification_templates as NotificationTemplate[] | undefined) || []
  const timestamp = new Date().toISOString()
  const templateId = validation.data.id ?? globalThis.crypto.randomUUID()

  const updatedTemplate: NotificationTemplate = {
    ...validation.data,
    id: templateId,
    updated_at: timestamp,
    created_at:
      validation.data.id && currentTemplates.find((existing) => existing.id === validation.data.id)?.created_at
        ? currentTemplates.find((existing) => existing.id === validation.data.id)!.created_at
        : timestamp,
  }

  const nextTemplates = currentTemplates.filter((existing) => existing.id !== templateId)
  nextTemplates.push(updatedTemplate)

  const { error } = await supabase.auth.updateUser({
    data: {
      notification_templates: nextTemplates,
    },
  })

  if (error) throw error

  revalidatePath('/business/notifications')
  return updatedTemplate
}

export async function deleteNotificationTemplate(templateId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const currentTemplates = (user.user_metadata?.notification_templates as NotificationTemplate[] | undefined) || []

  const nextTemplates = currentTemplates.filter((template) => template.id !== templateId)

  const { error } = await supabase.auth.updateUser({
    data: {
      notification_templates: nextTemplates,
    },
  })

  if (error) throw error

  revalidatePath('/business/notifications')
  return { success: true }
}

export async function sendTestNotification(templateId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const templates = (user.user_metadata?.notification_templates as NotificationTemplate[] | undefined) || []
  const template = templates.find((entry) => entry.id === templateId)

  if (!template) {
    throw new Error('Template not found')
  }

  return sendNotification({
    userId: user.id,
    title: template.subject || template.name,
    message: template.body.replace(/\{\{(.*?)\}\}/g, (_, placeholder) => `{{${placeholder.trim()}}}`),
    type: template.event,
    channels: [template.channel],
    data: {
      test: true,
      triggered_at: new Date().toISOString(),
    },
  })
}
