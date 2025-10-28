'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Bell, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { updateNotificationPreferences } from '@/features/shared/preferences/api/mutations'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { NotificationSection } from './notification-section'
import { NotificationToggleItem } from './notification-toggle-item'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const result = await updateNotificationPreferences(preferences)

    if (result.success) {
      setSuccess(true)
      router.refresh()
      const SUCCESS_MESSAGE_TIMEOUT = 3000
      setTimeout(() => setSuccess(false), SUCCESS_MESSAGE_TIMEOUT)
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  return (
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <ItemTitle>Notification preferences</ItemTitle>
        </div>
        <ItemDescription>
          Manage how you receive notifications and updates from Enorae
        </ItemDescription>
      </ItemHeader>
      <ItemContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <NotificationSection
            icon={<Mail className="h-4 w-4 text-muted-foreground" />}
            title="Email notifications"
          >
            <ItemGroup className="space-y-4 pl-6">
              <NotificationToggleItem
                id="email_appointments"
                labelId="notification-email-appointments-label"
                title="Appointment updates"
                description="Confirmations, reminders, and cancellations"
                checked={preferences.email_appointments ?? true}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, email_appointments: checked }))
                }
              />
              <NotificationToggleItem
                id="email_promotions"
                labelId="notification-email-promotions-label"
                title="Promotions and offers"
                description="Special deals and salon updates"
                checked={preferences.email_promotions ?? false}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, email_promotions: checked }))
                }
              />
            </ItemGroup>
          </NotificationSection>

          <NotificationSection
            icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
            title="SMS notifications"
          >
            <ItemGroup className="space-y-4 pl-6">
              <NotificationToggleItem
                id="sms_reminders"
                labelId="notification-sms-reminders-label"
                title="Appointment reminders"
                description="Get SMS reminders before your appointments"
                checked={preferences.sms_reminders ?? true}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, sms_reminders: checked }))
                }
              />
            </ItemGroup>
          </NotificationSection>

          <NotificationSection
            icon={<Smartphone className="h-4 w-4 text-muted-foreground" />}
            title="Push notifications"
          >
            <ItemGroup className="space-y-4 pl-6">
              <NotificationToggleItem
                id="push_enabled"
                labelId="notification-push-enabled-label"
                title="Enable push notifications"
                description="Receive real-time updates on your device"
                checked={preferences.push_enabled ?? true}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, push_enabled: checked }))
                }
              />
            </ItemGroup>
          </NotificationSection>

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
      </ItemContent>
    </Item>
  )
}
