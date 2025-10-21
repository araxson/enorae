'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateUserPreferences } from '../api/mutations'
import type { PrivacySettings } from '../types'

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
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Privacy Settings</h3>
          <p className="text-sm text-muted-foreground">Control who can see your information</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="profile_visible">Profile Visible to Clients</Label>
              <p className="text-sm text-muted-foreground text-sm">Allow clients to view your profile</p>
            </div>
            <Switch
              id="profile_visible"
              checked={settings.profile_visible_to_clients}
              onCheckedChange={() => handleToggle('profile_visible_to_clients')}
            />
          </div>

          <div className="flex gap-4 items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="show_ratings">Show Ratings</Label>
              <p className="text-sm text-muted-foreground text-sm">Display your ratings publicly</p>
            </div>
            <Switch
              id="show_ratings"
              checked={settings.show_ratings}
              onCheckedChange={() => handleToggle('show_ratings')}
            />
          </div>

          <div className="flex gap-4 items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="show_appointments">Show Completed Appointments</Label>
              <p className="text-sm text-muted-foreground text-sm">Display appointment count</p>
            </div>
            <Switch
              id="show_appointments"
              checked={settings.show_completed_appointments}
              onCheckedChange={() => handleToggle('show_completed_appointments')}
            />
          </div>

          <div className="flex gap-4 items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="allow_search">Allow Profile Search</Label>
              <p className="text-sm text-muted-foreground text-sm">Let clients find you in search</p>
            </div>
            <Switch
              id="allow_search"
              checked={settings.allow_profile_search}
              onCheckedChange={() => handleToggle('allow_profile_search')}
            />
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
