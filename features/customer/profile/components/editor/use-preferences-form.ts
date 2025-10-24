import { useState } from 'react'
import { toast } from 'sonner'
import { updateProfilePreferences } from '@/features/customer/profile/api/mutations'
import { profilePreferencesFormSchema } from '@/features/customer/profile/schema'
import type { ProfilePreferences } from './types'
import { parsePreferences } from './types'

export function usePreferencesForm(preferences: ProfilePreferences | null) {
  const [timezone, setTimezone] = useState(preferences?.timezone || 'America/New_York')
  const [locale, setLocale] = useState(preferences?.locale || 'en-US')
  const [currencyCode, setCurrencyCode] = useState(preferences?.currency_code || 'USD')
  const [isSaving, setIsSaving] = useState(false)

  const currentPrefs = parsePreferences(preferences?.preferences)

  const [emailNotifications, setEmailNotifications] = useState(
    currentPrefs.email_notifications ?? true
  )
  const [smsNotifications, setSmsNotifications] = useState(
    currentPrefs.sms_notifications ?? false
  )
  const [appointmentReminders, setAppointmentReminders] = useState(
    currentPrefs.appointment_reminders ?? true
  )
  const [marketingEmails, setMarketingEmails] = useState(
    currentPrefs.marketing_emails ?? false
  )

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const preferencesPayload = {
        timezone,
        locale,
        currencyCode,
        preferencesJson: JSON.stringify({
          email_notifications: emailNotifications,
          sms_notifications: smsNotifications,
          appointment_reminders: appointmentReminders,
          marketing_emails: marketingEmails,
        }),
      }

      const validation = profilePreferencesFormSchema.safeParse(preferencesPayload)
      if (!validation.success) {
        toast.error(validation.error.errors[0].message)
        return
      }

      const formData = new FormData()
      const validated = validation.data
      if (validated.timezone) {
        formData.append('timezone', validated.timezone)
      }
      if (validated.locale) {
        formData.append('locale', validated.locale)
      }
      if (validated.currencyCode) {
        formData.append('currency_code', validated.currencyCode)
      }
      if (validated.preferencesJson) {
        formData.append('preferences', validated.preferencesJson)
      }

      const result = await updateProfilePreferences(formData)
      if (result.success) {
        toast.success('Preferences updated')
      }
    } catch (error) {
      console.error('Failed to save preferences:', error)
      toast.error('Failed to save preferences. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    timezone,
    setTimezone,
    locale,
    setLocale,
    currencyCode,
    setCurrencyCode,
    emailNotifications,
    setEmailNotifications,
    smsNotifications,
    setSmsNotifications,
    appointmentReminders,
    setAppointmentReminders,
    marketingEmails,
    setMarketingEmails,
    isSaving,
    handleSave,
  }
}
