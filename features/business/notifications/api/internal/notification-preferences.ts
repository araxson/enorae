import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import type { NotificationPreferencesMetadata, NotificationTemplate } from './types'
import { defaultPreferences, defaultTemplates } from './constants'

export async function getNotificationPreferences() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const metadataPreferences =
    (user.user_metadata?.notification_preferences as NotificationPreferencesMetadata | undefined) || {}

  return {
    email: { ...defaultPreferences.email, ...(metadataPreferences.email || {}) },
    sms: { ...defaultPreferences.sms, ...(metadataPreferences.sms || {}) },
    in_app: { ...defaultPreferences.in_app, ...(metadataPreferences.in_app || {}) },
    push: metadataPreferences.push || {},
  }
}

export async function getNotificationTemplates(): Promise<NotificationTemplate[]> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const stored = user.user_metadata?.notification_templates as NotificationTemplate[] | undefined

  if (stored && Array.isArray(stored)) {
    return stored
  }

  // Provide default templates for common events
  return defaultTemplates
}
