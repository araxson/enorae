'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateUserPreferences } from '@/features/staff/settings/api/mutations'
import type { PrivacySettings } from '@/features/staff/settings/types'

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
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="profile_visible">Profile Visible to Clients</Label>
              <p className="text-sm text-muted-foreground">Allow clients to view your profile</p>
            </div>
            <Switch
              id="profile_visible"
              checked={settings.profile_visible_to_clients}
              onCheckedChange={() => handleToggle('profile_visible_to_clients')}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="show_ratings">Show Ratings</Label>
              <p className="text-sm text-muted-foreground">Display your ratings publicly</p>
            </div>
            <Switch
              id="show_ratings"
              checked={settings.show_ratings}
              onCheckedChange={() => handleToggle('show_ratings')}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="show_appointments">Show Completed Appointments</Label>
              <p className="text-sm text-muted-foreground">Display appointment count</p>
            </div>
            <Switch
              id="show_appointments"
              checked={settings.show_completed_appointments}
              onCheckedChange={() => handleToggle('show_completed_appointments')}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="allow_search">Allow Profile Search</Label>
              <p className="text-sm text-muted-foreground">Let clients find you in search</p>
            </div>
            <Switch
              id="allow_search"
              checked={settings.allow_profile_search}
              onCheckedChange={() => handleToggle('allow_profile_search')}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
