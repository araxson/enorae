'use client'

import { useEffect, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateNotificationPreferences } from '@/features/business/notifications/api/mutations'
import { useToast } from '@/lib/hooks/use-toast'

type ChannelPreferences = Record<string, boolean>

type NotificationPreferencesFormProps = {
  preferences: {
    email: ChannelPreferences
    sms: ChannelPreferences
    in_app: ChannelPreferences
    push?: ChannelPreferences
  }
}

const channelCopy: Record<string, { label: string; description: string }> = {
  email: {
    label: 'Email Notifications',
    description: 'Send detailed messages to customer inboxes.',
  },
  sms: {
    label: 'SMS Alerts',
    description: 'Send short reminders and confirmations by text message.',
  },
  in_app: {
    label: 'In-App',
    description: 'Display notifications inside the business portal.',
  },
  push: {
    label: 'Push Notifications',
    description: 'Mobile or desktop push alerts for real-time updates.',
  },
}

export function NotificationPreferencesForm({ preferences }: NotificationPreferencesFormProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState(preferences)

  useEffect(() => {
    setState(preferences)
  }, [preferences])

  const handleToggle = (channel: keyof typeof state, event: string, value: boolean) => {
    setState((current) => ({
      ...current,
      [channel]: {
        ...current[channel],
        [event]: value,
      },
    }))
  }

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateNotificationPreferences(state)
        toast({
          title: 'Preferences saved',
          description: 'Notification preferences updated successfully.',
        })
      } catch (error) {
        toast({
          title: 'Unable to save preferences',
          description: error instanceof Error ? error.message : 'Please try again.',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Delivery Preferences</CardTitle>
          <CardDescription>Control which events trigger notifications per channel</CardDescription>
        </div>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {Object.entries(state).map(([channel, events]) => (
            <Card key={channel} className="border-muted">
              <CardHeader>
                <CardTitle>
                  {channelCopy[channel]?.label || channel.toUpperCase()}
                </CardTitle>
                <CardDescription>
                  {channelCopy[channel]?.description || 'Configure event triggers'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {Object.entries(events).map(([event, value]) => (
                    <div
                      key={event}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <div>
                        <Label className="capitalize">
                          {event.replace(/_/g, ' ')}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Trigger when {event.replace(/_/g, ' ')} occurs
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          handleToggle(channel as keyof typeof state, event, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
