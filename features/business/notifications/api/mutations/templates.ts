'use server'
import 'server-only'

import { z } from 'zod'
import { getSupabaseClient, revalidateNotifications, notificationChannels, notificationEvents } from '../mutations/utilities'
import type { NotificationTemplate } from '@/features/business/notifications/api/queries'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

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
  const logger = createOperationLogger('upsertNotificationTemplate', {})
  logger.start()

  // ASYNC FIX: Wrap in try-catch to handle all Promise rejections
  try {
    const supabase = await getSupabaseClient()

    const validation = templateSchema.safeParse(template)
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message ?? 'Validation failed'
      logger.error(errorMsg, 'validation')
      return { success: false, error: errorMsg }
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      logger.error(authError, 'auth')
      return { success: false, error: authError.message }
    }
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

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

    if (error) {
      logger.error(error, 'database')
      return { success: false, error: error.message }
    }

    revalidateNotifications()
    logger.success()
    return { success: true, data: updatedTemplate }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to upsert template'
    logger.error(error instanceof Error ? error : new Error(String(error)), 'unknown')
    return { success: false, error: errorMessage }
  }
}

export async function deleteNotificationTemplate(templateId: string) {
  const logger = createOperationLogger('deleteNotificationTemplate', {})
  logger.start()

  // ASYNC FIX: Wrap in try-catch to handle all Promise rejections
  try {
    const supabase = await getSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      logger.error(authError, 'auth')
      return { success: false, error: authError.message }
    }
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

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

    if (error) {
      logger.error(error, 'database')
      return { success: false, error: error.message }
    }

    revalidateNotifications()
    logger.success()
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete template'
    logger.error(error instanceof Error ? error : new Error(String(error)), 'unknown')
    return { success: false, error: errorMessage }
  }
}
