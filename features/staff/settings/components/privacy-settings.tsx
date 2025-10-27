'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { updateUserPreferences } from '@/features/staff/settings/api/mutations'
import type { PrivacySettings } from '@/features/staff/settings/types'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

interface PrivacySettingsProps {
  initialSettings: PrivacySettings
}

export function PrivacySettings({ initialSettings }: PrivacySettingsProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (key: keyof PrivacySettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateUserPreferences({ privacy_settings: settings })
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Control who can see your information.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldSet>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="profile_visible">Profile visible to clients</FieldLabel>
            <FieldContent>
              <FieldDescription>Allow clients to view your profile</FieldDescription>
              <div className="flex justify-end">
                <Switch
                  id="profile_visible"
                  checked={settings.profile_visible_to_clients}
                  onCheckedChange={() => handleToggle('profile_visible_to_clients')}
                />
              </div>
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel htmlFor="show_ratings">Show ratings</FieldLabel>
            <FieldContent>
              <FieldDescription>Display your ratings publicly</FieldDescription>
              <div className="flex justify-end">
                <Switch
                  id="show_ratings"
                  checked={settings.show_ratings}
                  onCheckedChange={() => handleToggle('show_ratings')}
                />
              </div>
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel htmlFor="show_appointments">Show completed appointments</FieldLabel>
            <FieldContent>
              <FieldDescription>Display appointment count</FieldDescription>
              <div className="flex justify-end">
                <Switch
                  id="show_appointments"
                  checked={settings.show_completed_appointments}
                  onCheckedChange={() => handleToggle('show_completed_appointments')}
                />
              </div>
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel htmlFor="allow_search">Allow profile search</FieldLabel>
            <FieldContent>
              <FieldDescription>Let clients find you in search</FieldDescription>
              <div className="flex justify-end">
                <Switch
                  id="allow_search"
                  checked={settings.allow_profile_search}
                  onCheckedChange={() => handleToggle('allow_profile_search')}
                />
              </div>
            </FieldContent>
          </Field>
        </FieldSet>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-end">
          <ButtonGroup>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </ButtonGroup>
        </div>
      </CardFooter>
    </Card>
  )
}
