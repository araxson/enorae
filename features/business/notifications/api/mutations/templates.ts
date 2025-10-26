import 'server-only'

import { z } from 'zod'
import { getSupabaseClient, revalidateNotifications, notificationChannels, notificationEvents } from '../mutations/utilities'
import type { NotificationTemplate } from '@/features/business/notifications/api/queries'

const templateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  channel: z.enum(notificationChannels),
  event: z.enum(notificationEvents),
  subject: z.string().optional(),
  body: z.string().min(10),
})

type TemplateInput = z.infer<typeof templateSchema>

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
  template: TemplateInput,
) {
  const supabase = await getSupabaseClient()

  const validation = templateSchema.safeParse(template)
  if (!validation.success) {
    throw new Error(validation.error.issues[0]?.message ?? 'Validation failed')
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error('Unauthorized')

  const currentTemplates =
    (user.user_metadata?.['notification_templates'] as
      | NotificationTemplate[]
      | undefined) ?? []

  const timestamp = new Date().toISOString()
  const templateId = validation.data.id ?? globalThis.crypto.randomUUID()

  const existing = currentTemplates.find(
    (entry) => entry.id === validation.data.id,
  )

  const updatedTemplate: NotificationTemplate = {
    id: templateId,
    name: validation.data.name,
    description: validation.data.description ?? undefined,
    channel: validation.data.channel,
    event: validation.data.event,
    subject: validation.data.subject ?? undefined,
    body: validation.data.body,
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
    (user.user_metadata?.['notification_templates'] as
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
