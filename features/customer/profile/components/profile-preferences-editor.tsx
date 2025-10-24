'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Bell, Globe, DollarSign, Shield } from 'lucide-react'
import { updateProfilePreferences } from '@/features/customer/profile/api/mutations'
import type { Database } from '@/lib/types/database.types'

type ProfilePreferences = Database['public']['Views']['profiles_preferences']['Row']

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
    email_notifications: typeof source.email_notifications === 'boolean' ? source.email_notifications : undefined,
    sms_notifications: typeof source.sms_notifications === 'boolean' ? source.sms_notifications : undefined,
    appointment_reminders: typeof source.appointment_reminders === 'boolean' ? source.appointment_reminders : undefined,
    marketing_emails: typeof source.marketing_emails === 'boolean' ? source.marketing_emails : undefined,
  }
}

interface ProfilePreferencesEditorProps {
  preferences: ProfilePreferences | null
}

export function ProfilePreferencesEditor({ preferences }: ProfilePreferencesEditorProps) {
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
        <CardTitle>Account Preferences</CardTitle>
        <CardDescription>
          Manage your notification settings, regional preferences, and privacy options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Regional Settings */}
          <div>
            <Label className="flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4" />
              Regional Settings
            </Label>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="timezone" className="text-sm mb-2 block">
                  Timezone
                </Label>
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
              </div>

              <div>
                <Label htmlFor="locale" className="text-sm mb-2 block">
                  Language
                </Label>
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
              </div>

              <div>
                <Label htmlFor="currency" className="text-sm mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Currency
                </Label>
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
              </div>
            </div>
          </div>

          <Separator />

          {/* Notification Preferences */}
          <div>
            <Label className="flex items-center gap-2 mb-4">
              <Bell className="h-4 w-4" />
              Notification Preferences
            </Label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground text-xs">Receive updates via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground text-xs">Receive text message alerts</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
                  <p className="text-sm text-muted-foreground text-xs">Get reminders before appointments</p>
                </div>
                <Switch
                  id="appointment-reminders"
                  checked={appointmentReminders}
                  onCheckedChange={setAppointmentReminders}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground text-xs">Receive promotional offers and news</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Privacy Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Privacy &amp; Data</AlertTitle>
            <AlertDescription>
              Your preferences are stored securely and only used to improve your experience.
              You can update these settings at any time.
            </AlertDescription>
          </Alert>

          {/* Save Button */}
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
