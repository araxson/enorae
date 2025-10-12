'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Stack, Flex } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
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
      <Stack gap="lg">
        <div>
          <H3>Privacy Settings</H3>
          <Muted>Control who can see your information</Muted>
        </div>

        <Stack gap="md">
          <Flex justify="between" align="center">
            <div className="flex-1">
              <Label htmlFor="profile_visible">Profile Visible to Clients</Label>
              <Muted className="text-sm">Allow clients to view your profile</Muted>
            </div>
            <Switch
              id="profile_visible"
              checked={settings.profile_visible_to_clients}
              onCheckedChange={() => handleToggle('profile_visible_to_clients')}
            />
          </Flex>

          <Flex justify="between" align="center">
            <div className="flex-1">
              <Label htmlFor="show_ratings">Show Ratings</Label>
              <Muted className="text-sm">Display your ratings publicly</Muted>
            </div>
            <Switch
              id="show_ratings"
              checked={settings.show_ratings}
              onCheckedChange={() => handleToggle('show_ratings')}
            />
          </Flex>

          <Flex justify="between" align="center">
            <div className="flex-1">
              <Label htmlFor="show_appointments">Show Completed Appointments</Label>
              <Muted className="text-sm">Display appointment count</Muted>
            </div>
            <Switch
              id="show_appointments"
              checked={settings.show_completed_appointments}
              onCheckedChange={() => handleToggle('show_completed_appointments')}
            />
          </Flex>

          <Flex justify="between" align="center">
            <div className="flex-1">
              <Label htmlFor="allow_search">Allow Profile Search</Label>
              <Muted className="text-sm">Let clients find you in search</Muted>
            </div>
            <Switch
              id="allow_search"
              checked={settings.allow_profile_search}
              onCheckedChange={() => handleToggle('allow_profile_search')}
            />
          </Flex>
        </Stack>

        <Flex justify="end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Flex>
      </Stack>
    </Card>
  )
}
