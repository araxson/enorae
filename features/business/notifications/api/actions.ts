'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import {
  notificationSchema,
  getSupabaseClient,
  ensureRecipientAuthorized,
  revalidateNotifications,
  notificationIdsSchema,
  notificationChannels,
  notificationEvents,
} from './mutations/helpers'
import type { Database, Json } from '@/lib/types/database.types'
import type { NotificationTemplate } from './queries'

// ============================================================================
// TYPES
// ============================================================================

type TemplateInput = z.infer<typeof templateSchema>

const templateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  channel: z.enum(notificationChannels),
  event: z.enum(notificationEvents),
  subject: z.string().optional(),
  body: z.string().min(10),
})

const updatePreferencesSchema = z.object({
  preferences: z.object({
    email: z.record(z.boolean()).optional(),
    sms: z.record(z.boolean()).optional(),
    in_app: z.record(z.boolean()).optional(),
    push: z.record(z.boolean()).optional(),
  }),
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getTemplateId(template: TemplateInput) {
  return template.id ?? globalThis.crypto.randomUUID()
}

function normalizeTemplates(
  existing: NotificationTemplate[] | undefined,
  updated: NotificationTemplate,
) {
  const collection = Array.isArray(existing) ? [...existing] : []
  const withoutCurrent = collection.filter(
    (template) => template.id !== updated.id,
  )
  withoutCurrent.push(updated)
  return withoutCurrent
}

// ============================================================================
// SEND ACTIONS
// ============================================================================

export async function sendNotification(input: {
  userId: string
  title: string
  message: string
  type: string
  channels?: string[]
  data?: Record<string, unknown>
}) {
  const supabase = await getSupabaseClient()

  const validation = notificationSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const { userId, title, message, type, channels, data } = validation.data

  const payloadData: Json | undefined = data
    ? (JSON.parse(JSON.stringify(data)) as Json)
    : undefined

  await ensureRecipientAuthorized(supabase, userId)

  const { data: notificationId, error } = await supabase
    .schema('communication')
    .rpc('send_notification', {
      p_user_id: userId,
      p_title: title,
      p_message: message,
      p_type: type,
      p_channels: channels,
      p_data: payloadData,
    })

  if (error) throw error

  revalidateNotifications()
  return {
    success: true,
    notificationId: notificationId as Database['communication']['Functions']['send_notification']['Returns'],
  }
}

export async function markNotificationsRead(notificationIds?: string[]) {
  const supabase = await getSupabaseClient()

  const validation = notificationIdsSchema.safeParse(notificationIds)
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error('Unauthorized')

  const { data: count, error } = await supabase
    .schema('communication')
    .rpc('mark_notifications_read', {
      p_user_id: user.id,
      p_notification_ids: validation.data,
    })

  if (error) throw error

  revalidateNotifications()
  return {
    success: true,
    markedCount:
      (count as Database['communication']['Functions']['mark_notifications_read']['Returns']) ?? 0,
  }
}

// ============================================================================
// PREFERENCES ACTIONS
// ============================================================================

export async function updateNotificationPreferences(preferences: {
  email?: Record<string, boolean>
  sms?: Record<string, boolean>
  in_app?: Record<string, boolean>
  push?: Record<string, boolean>
}) {
  const supabase = await getSupabaseClient()

  const validation = updatePreferencesSchema.safeParse({ preferences })
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.auth.updateUser({
    data: {
      notification_preferences: preferences,
    },
  })

  if (error) throw error

  revalidateNotifications()
  return { success: true }
}

// ============================================================================
// TEMPLATE ACTIONS
// ============================================================================

export async function upsertNotificationTemplate(template: TemplateInput) {
  const supabase = await getSupabaseClient()

  const validation = templateSchema.safeParse(template)
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message)
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error('Unauthorized')

  const currentTemplates =
    (user.user_metadata?.notification_templates as
      | NotificationTemplate[]
      | undefined) ?? []

  const timestamp = new Date().toISOString()
  const templateId = getTemplateId(validation.data)

  const existing = currentTemplates.find(
    (entry) => entry.id === validation.data.id,
  )

  const updatedTemplate: NotificationTemplate = {
    ...validation.data,
    id: templateId,
    updated_at: timestamp,
    created_at: existing?.created_at ?? timestamp,
  }

  const nextTemplates = normalizeTemplates(currentTemplates, updatedTemplate)

  const { error } = await supabase.auth.updateUser({
    data: {
      notification_templates: nextTemplates,
    },
  })

  if (error) throw error

  revalidateNotifications()
  return updatedTemplate
}

export async function deleteNotificationTemplate(templateId: string) {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error('Unauthorized')

  const currentTemplates =
    (user.user_metadata?.notification_templates as
      | NotificationTemplate[]
      | undefined) ?? []

  const nextTemplates = currentTemplates.filter(
    (template) => template.id !== templateId,
  )

  const { error } = await supabase.auth.updateUser({
    data: {
      notification_templates: nextTemplates,
    },
  })

  if (error) throw error

  revalidateNotifications()
  return { success: true }
}

// ============================================================================
// WORKFLOW ACTIONS
// ============================================================================

export async function sendAppointmentConfirmation(
  customerId: string,
  details: {
    id: string
    startTime: string
    serviceName: string
    staffName: string
  },
) {
  return sendNotification({
    userId: customerId,
    title: 'Appointment Confirmed',
    message: `Your appointment for ${details.serviceName} with ${details.staffName} is confirmed for ${new Date(details.startTime).toLocaleString()}.`,
    type: 'appointment_confirmation',
    channels: ['email', 'sms', 'in_app'],
    data: details,
  })
}

export async function sendAppointmentReminder(
  customerId: string,
  details: {
    id: string
    startTime: string
    serviceName: string
    staffName: string
  },
) {
  return sendNotification({
    userId: customerId,
    title: 'Appointment Reminder',
    message: `Reminder: You have an appointment for ${details.serviceName} with ${details.staffName} tomorrow at ${new Date(details.startTime).toLocaleString()}.`,
    type: 'appointment_reminder',
    channels: ['email', 'sms', 'in_app', 'push'],
    data: details,
  })
}

export async function sendReviewRequest(
  customerId: string,
  details: {
    id: string
    serviceName: string
    salonName: string
  },
) {
  return sendNotification({
    userId: customerId,
    title: 'How was your experience?',
    message: `We'd love to hear about your experience with ${details.serviceName} at ${details.salonName}!`,
    type: 'review_request',
    channels: ['email', 'in_app'],
    data: details,
  })
}

export async function sendTestNotification(templateId: string) {
  const { sendNotificationForTemplate } = await import('./mutations/test')
  return sendNotificationForTemplate(templateId)
}
