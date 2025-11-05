'use client'
import { useState } from 'react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { updateUserPreferences } from '@/features/staff/settings/api/mutations'
import type { NotificationPreferences, NotificationChannel } from '@/features/staff/settings/api/types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ButtonGroup } from '@/components/ui/button-group'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'

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
  const [error, setError] = useState<string | null>(null)

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
      setError(null)
      await updateUserPreferences({ notification_preferences: preferences })
      toast.success('Notification preferences saved')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save preferences'
      setError(message)
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified.</CardDescription>
      </CardHeader>
      <div className="px-6">
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Unable to save preferences</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                {channels.map((channel) => (
                  <TableHead key={channel.value} className="text-center">
                    {channel.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {notificationTypes.map((type) => (
                <TableRow key={type.key}>
                  <TableCell>{type.label}</TableCell>
                  {channels.map((channel) => (
                    <TableCell key={channel.value} className="text-center">
                      <Checkbox
                        checked={preferences[type.key].includes(channel.value)}
                        onCheckedChange={() => handleToggle(type.key, channel.value)}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <CardFooter className="flex w-full justify-end">
        <ButtonGroup>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Spinner className="size-4" />
                <span>Saving…</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}
