import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type NotificationType = Database['public']['Enums']['notification_type']

type NotificationPreferencesMetadata = {
  email?: Partial<Record<NotificationType, boolean>>
  sms?: Partial<Record<NotificationType, boolean>>
  in_app?: Partial<Record<NotificationType, boolean>>
  push?: Record<string, boolean>
}

const defaultPreferences = {
  email: {
    appointment_confirmation: true,
    appointment_reminder: true,
    appointment_cancelled: true,
    review_request: true,
    staff_message: true,
    system_alert: true,
  },
  sms: {
    appointment_confirmation: false,
    appointment_reminder: true,
    appointment_cancelled: true,
    review_request: false,
    staff_message: false,
    system_alert: false,
  },
  in_app: {
    appointment_confirmation: true,
    appointment_reminder: true,
    appointment_cancelled: true,
    review_request: true,
    staff_message: true,
    system_alert: true,
  },
}

export async function getNotificationPreferences() {
  const logger = createOperationLogger('getNotificationPreferences', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const metadataPreferences =
    (user.user_metadata?.['notification_preferences'] as NotificationPreferencesMetadata | undefined) || {}

  return {
    email: { ...defaultPreferences['email'], ...(metadataPreferences['email'] || {}) },
    sms: { ...defaultPreferences.sms, ...(metadataPreferences.sms || {}) },
    in_app: { ...defaultPreferences.in_app, ...(metadataPreferences.in_app || {}) },
    push: metadataPreferences.push || {},
  }
}
