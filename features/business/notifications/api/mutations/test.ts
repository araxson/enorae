'use server'
import 'server-only'

import type { NotificationTemplate } from '@/features/business/notifications/api/queries'
import { getSupabaseClient } from './utilities'
import { sendNotification } from './send'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function sendNotificationForTemplate(templateId: string) {
  const logger = createOperationLogger('sendNotificationForTemplate', {})
  logger.start()

  const supabase = await getSupabaseClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error('Unauthorized')

  const templates =
    (user.user_metadata?.['notification_templates'] as
      | NotificationTemplate[]
      | undefined) ?? []

  const template = templates.find((entry) => entry.id === templateId)

  if (!template) {
    throw new Error('Template not found')
  }

  const message = template.body.replace(
    /\{\{(.*?)\}\}/g,
    (_: string, placeholder: string) => `{{${placeholder.trim()}}}`,
  )

  return sendNotification({
    userId: user.id,
    title: template.subject || template.name,
    message,
    type: template.event,
    channels: [template.channel],
    data: {
      test: true,
      triggered_at: new Date().toISOString(),
    },
  })
}
