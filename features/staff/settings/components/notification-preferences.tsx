'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Stack, Flex } from '@/components/layout'
import { updateUserPreferences } from '../api/mutations'
import type { NotificationPreferences, NotificationChannel } from '../types'

interface NotificationPreferencesProps {
  initialPreferences: NotificationPreferences
}

const channels: { value: NotificationChannel; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push' },
  { value: 'in_app', label: 'In-App' },
]

const notificationTypes = [
  { key: 'appointments' as const, label: 'Appointments' },
  { key: 'messages' as const, label: 'Messages' },
  { key: 'schedule_changes' as const, label: 'Schedule Changes' },
  { key: 'time_off_updates' as const, label: 'Time Off Updates' },
  { key: 'commission_updates' as const, label: 'Commission Updates' },
]

export function NotificationPreferences({ initialPreferences }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (type: keyof NotificationPreferences, channel: NotificationChannel) => {
    setPreferences(prev => ({
      ...prev,
      [type]: prev[type].includes(channel)
        ? prev[type].filter(c => c !== channel)
        : [...prev[type], channel],
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateUserPreferences({ notification_preferences: preferences })
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="p-6">
      <Stack gap="lg">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Type</th>
                {channels.map(channel => (
                  <th key={channel.value} className="text-center p-2">{channel.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notificationTypes.map(type => (
                <tr key={type.key} className="border-b">
                  <td className="p-2">{type.label}</td>
                  {channels.map(channel => (
                    <td key={channel.value} className="text-center p-2">
                      <Checkbox
                        checked={preferences[type.key].includes(channel.value)}
                        onCheckedChange={() => handleToggle(type.key, channel.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Flex justify="end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Flex>
      </Stack>
    </Card>
  )
}
