import 'server-only'

import { z } from 'zod'
import { getSupabaseClient, revalidateNotifications, notificationChannels, notificationEvents } from './helpers'
import type { NotificationTemplate } from '../queries'

const templateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  channel: z.enum(notificationChannels),
  event: z.enum(notificationEvents),
  subject: z.string().optional(),
  body: z.string().min(10),
})

function getTemplateId(template: NotificationTemplate) {
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

export async function upsertNotificationTemplate(
  template: NotificationTemplate,
) {
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
