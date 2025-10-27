'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Bell, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { updateNotificationPreferences } from '@/features/shared/preferences/api/mutations'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface NotificationPreferences {
  email_appointments?: boolean
  email_promotions?: boolean
  sms_reminders?: boolean
  push_enabled?: boolean
}

interface NotificationPreferencesFormProps {
  initialPreferences?: NotificationPreferences
}

export function NotificationPreferencesForm({
  initialPreferences = {},
}: NotificationPreferencesFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_appointments: initialPreferences.email_appointments ?? true,
    email_promotions: initialPreferences.email_promotions ?? false,
    sms_reminders: initialPreferences.sms_reminders ?? true,
    push_enabled: initialPreferences.push_enabled ?? true,
  })
  const emailAppointmentsLabelId = 'notification-email-appointments-label'
  const emailPromotionsLabelId = 'notification-email-promotions-label'
  const smsRemindersLabelId = 'notification-sms-reminders-label'
  const pushEnabledLabelId = 'notification-push-enabled-label'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const result = await updateNotificationPreferences(preferences)

    if (result.success) {
      setSuccess(true)
      router.refresh()
      const SUCCESS_MESSAGE_TIMEOUT = 3000 // 3 seconds
      setTimeout(() => setSuccess(false), SUCCESS_MESSAGE_TIMEOUT)
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Notification preferences</CardTitle>
        </div>
        <CardDescription>
          Manage how you receive notifications and updates from Enorae
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Email notifications</h3>
            </div>

            <ItemGroup className="space-y-4 pl-6">
              <Item>
                <ItemContent>
                  <ItemTitle id={emailAppointmentsLabelId}>Appointment updates</ItemTitle>
                  <ItemDescription>
                    Confirmations, reminders, and cancellations
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="flex-none">
                  <Switch
                    id="email_appointments"
                    aria-labelledby={emailAppointmentsLabelId}
                    checked={preferences.email_appointments}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, email_appointments: checked }))
                    }
                  />
                </ItemActions>
              </Item>

              <Item>
                <ItemContent>
                  <ItemTitle id={emailPromotionsLabelId}>Promotions and offers</ItemTitle>
                  <ItemDescription>
                    Special deals and salon updates
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="flex-none">
                  <Switch
                    id="email_promotions"
                    aria-labelledby={emailPromotionsLabelId}
                    checked={preferences.email_promotions}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, email_promotions: checked }))
                    }
                  />
                </ItemActions>
              </Item>
            </ItemGroup>
          </div>

          {/* SMS Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">SMS notifications</h3>
            </div>

            <ItemGroup className="space-y-4 pl-6">
              <Item>
                <ItemContent>
                  <ItemTitle id={smsRemindersLabelId}>Appointment reminders</ItemTitle>
                  <ItemDescription>
                    Get SMS reminders before your appointments
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="flex-none">
                  <Switch
                    id="sms_reminders"
                    aria-labelledby={smsRemindersLabelId}
                    checked={preferences.sms_reminders}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, sms_reminders: checked }))
                    }
                  />
                </ItemActions>
              </Item>
            </ItemGroup>
          </div>

          {/* Push Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Push notifications</h3>
            </div>

            <ItemGroup className="space-y-4 pl-6">
              <Item>
                <ItemContent>
                  <ItemTitle id={pushEnabledLabelId}>Enable push notifications</ItemTitle>
                  <ItemDescription>
                    Receive real-time updates on your device
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="flex-none">
                  <Switch
                    id="push_enabled"
                    aria-labelledby={pushEnabledLabelId}
                    checked={preferences.push_enabled}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, push_enabled: checked }))
                    }
                  />
                </ItemActions>
              </Item>
            </ItemGroup>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Update failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Preferences saved</AlertTitle>
              <AlertDescription>Preferences updated successfully!</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="size-4" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save preferences</span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
