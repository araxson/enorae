'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Bell, Globe, DollarSign, Shield } from 'lucide-react'
import { updateProfilePreferences } from '@/features/customer/profile/api/mutations'
import type { Database } from '@/lib/types/database.types'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'

type ProfilePreferences = Database['public']['Views']['profiles_preferences_view']['Row']

type PreferenceSettings = {
  email_notifications?: boolean
  sms_notifications?: boolean
  appointment_reminders?: boolean
  marketing_emails?: boolean
}

const parsePreferences = (value: ProfilePreferences['preferences'] | undefined): PreferenceSettings => {
  if (!value || typeof value !== 'object') {
    return {}
  }

  const source = value as Record<string, unknown>
  return {
    email_notifications: typeof source['email_notifications'] === 'boolean' ? source['email_notifications'] : undefined,
    sms_notifications: typeof source['sms_notifications'] === 'boolean' ? source['sms_notifications'] : undefined,
    appointment_reminders: typeof source['appointment_reminders'] === 'boolean' ? source['appointment_reminders'] : undefined,
    marketing_emails: typeof source['marketing_emails'] === 'boolean' ? source['marketing_emails'] : undefined,
  }
}

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
      formData.append('preferences', JSON.stringify({
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        appointment_reminders: appointmentReminders,
        marketing_emails: marketingEmails,
      }))

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
            <FieldSet>
              <FieldLegend>Regional defaults</FieldLegend>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                  <FieldContent>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="locale">Language</FieldLabel>
                  <FieldContent>
                    <Select value={locale} onValueChange={setLocale}>
                      <SelectTrigger id="locale">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="es-ES">Spanish</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                        <SelectItem value="de-DE">German</SelectItem>
                        <SelectItem value="ja-JP">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="currency">
                    <span className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Currency
                    </span>
                  </FieldLabel>
                  <FieldContent>
                    <Select value={currencyCode} onValueChange={setCurrencyCode}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldSet>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <FieldSet>
              <FieldLegend>Notification preferences</FieldLegend>
              <FieldGroup className="gap-4">
                <Field orientation="responsive">
                  <FieldLabel htmlFor="email-notifications">Email notifications</FieldLabel>
                  <FieldContent className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <FieldDescription>Receive updates via email</FieldDescription>
                    <Switch
                      className="sm:ml-4"
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </FieldContent>
                </Field>

                <Field orientation="responsive">
                  <FieldLabel htmlFor="sms-notifications">SMS notifications</FieldLabel>
                  <FieldContent className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <FieldDescription>Receive text message alerts</FieldDescription>
                    <Switch
                      className="sm:ml-4"
                      id="sms-notifications"
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </FieldContent>
                </Field>

                <Field orientation="responsive">
                  <FieldLabel htmlFor="appointment-reminders">Appointment reminders</FieldLabel>
                  <FieldContent className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <FieldDescription>Get reminders before appointments</FieldDescription>
                    <Switch
                      className="sm:ml-4"
                      id="appointment-reminders"
                      checked={appointmentReminders}
                      onCheckedChange={setAppointmentReminders}
                    />
                  </FieldContent>
                </Field>

                <Field orientation="responsive">
                  <FieldLabel htmlFor="marketing-emails">Marketing emails</FieldLabel>
                  <FieldContent className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <FieldDescription>Receive promotional offers and news</FieldDescription>
                    <Switch
                      className="sm:ml-4"
                      id="marketing-emails"
                      checked={marketingEmails}
                      onCheckedChange={setMarketingEmails}
                    />
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldSet>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Privacy &amp; Data</AlertTitle>
              <AlertDescription>
                Your preferences are stored securely and only used to improve your experience.
                You can update these settings at any time.
              </AlertDescription>
            </Alert>
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
