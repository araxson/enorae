'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, Globe, Shield } from 'lucide-react'
import { updateProfilePreferences } from '@/features/customer/profile/api/mutations'
import type { Database } from '@/lib/types/database.types'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemContent, ItemGroup, ItemMedia } from '@/components/ui/item'
import { RegionalPreferencesTab } from './preferences/regional-preferences-tab'
import { NotificationsPreferencesTab } from './preferences/notifications-preferences-tab'
import { parsePreferences } from './preferences/helpers'

type ProfilePreferences = Database['public']['Views']['profiles_preferences_view']['Row']

interface ProfilePreferencesEditorProps {
  preferences: ProfilePreferences | null
}

export function ProfilePreferencesEditor({ preferences }: ProfilePreferencesEditorProps) {
  const [timezone, setTimezone] = useState(preferences?.['timezone'] || 'America/New_York')
  const [locale, setLocale] = useState(preferences?.['locale'] || 'en-US')
  const [currencyCode, setCurrencyCode] = useState(preferences?.['currency_code'] || 'USD')
  const [isSaving, setIsSaving] = useState(false)

  const currentPrefs = parsePreferences(preferences?.['preferences'])

  const [emailNotifications, setEmailNotifications] = useState(
    currentPrefs['email_notifications'] ?? true
  )
  const [smsNotifications, setSmsNotifications] = useState(
    currentPrefs['sms_notifications'] ?? false
  )
  const [appointmentReminders, setAppointmentReminders] = useState(
    currentPrefs['appointment_reminders'] ?? true
  )
  const [marketingEmails, setMarketingEmails] = useState(
    currentPrefs['marketing_emails'] ?? false
  )

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('timezone', timezone)
      formData.append('locale', locale)
      formData.append('currency_code', currencyCode)
      formData.append(
        'preferences',
        JSON.stringify({
          email_notifications: emailNotifications,
          sms_notifications: smsNotifications,
          appointment_reminders: appointmentReminders,
          marketing_emails: marketingEmails,
        })
      )

      await updateProfilePreferences(formData)
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <Shield className="h-4 w-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>Account Preferences</CardTitle>
              <CardDescription>
                Manage your notification settings, regional preferences, and privacy options
              </CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="regional" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="regional">
              <Globe className="mr-2 h-4 w-4" />
              Regional
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="regional" className="space-y-4">
            <RegionalPreferencesTab
              timezone={timezone}
              setTimezone={setTimezone}
              locale={locale}
              setLocale={setLocale}
              currencyCode={currencyCode}
              setCurrencyCode={setCurrencyCode}
            />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <NotificationsPreferencesTab
              emailNotifications={emailNotifications}
              setEmailNotifications={setEmailNotifications}
              smsNotifications={smsNotifications}
              setSmsNotifications={setSmsNotifications}
              appointmentReminders={appointmentReminders}
              setAppointmentReminders={setAppointmentReminders}
              marketingEmails={marketingEmails}
              setMarketingEmails={setMarketingEmails}
            />
          </TabsContent>
        </Tabs>

        <Button onClick={handleSave} disabled={isSaving} className="mt-6 w-full">
          {isSaving ? (
            <>
              <Spinner className="size-4" />
              <span>Saving</span>
            </>
          ) : (
            <span>Save Preferences</span>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
