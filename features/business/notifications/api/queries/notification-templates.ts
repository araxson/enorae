import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

type NotificationChannel = Database['public']['Enums']['notification_channel']
type NotificationType = Database['public']['Enums']['notification_type']

export type NotificationTemplate = {
  id: string
  name: string
  description?: string
  channel: NotificationChannel
  event: NotificationType
  subject?: string | null
  body: string
  updated_at?: string
  created_at?: string
}

export async function getNotificationTemplates(): Promise<NotificationTemplate[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const stored = user.user_metadata?.['notification_templates'] as NotificationTemplate[] | undefined

  if (stored && Array.isArray(stored)) {
    return stored
  }

  // Provide default templates for common events
  return [
    {
      id: 'default-confirmation',
      name: 'Appointment Confirmation',
      channel: 'email',
      event: 'appointment_confirmation',
      subject: 'Your appointment is confirmed!',
      body:
        'Hi {{customer_name}}, your appointment for {{service_name}} on {{appointment_date}} is confirmed. We look forward to seeing you!',
    },
    {
      id: 'default-reminder',
      name: 'Appointment Reminder',
      channel: 'sms',
      event: 'appointment_reminder',
      body:
        'Reminder: {{service_name}} with {{staff_name}} at {{appointment_time}}. Reply YES to confirm or call us to reschedule.',
    },
  ]
}
