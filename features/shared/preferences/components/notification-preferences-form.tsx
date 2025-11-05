'use client'

import { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Bell, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { updateNotificationPreferencesAction } from '@/features/shared/preferences/api/actions'
import {
  Item,
  ItemContent,
  ItemDescription,
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

interface FormState {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
  data?: unknown
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <Button type="submit" disabled={disabled}>
      <span>Save preferences</span>
    </Button>
  )
}

export function NotificationPreferencesForm({
  initialPreferences = {},
}: NotificationPreferencesFormProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_appointments: initialPreferences.email_appointments ?? true,
    email_promotions: initialPreferences.email_promotions ?? false,
    sms_reminders: initialPreferences.sms_reminders ?? true,
    push_enabled: initialPreferences.push_enabled ?? true,
  })

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    updateNotificationPreferencesAction,
    {}
  )

  // Reset success state after showing message
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        // Success message will naturally disappear when state changes
      }, 3000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [state.success])

  return (
    <Item variant="outline">
      <ItemHeader>
        <div className="flex items-center gap-2">
          <Bell className="size-5" />
          <ItemTitle>Notification preferences</ItemTitle>
        </div>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>
          Manage how you receive notifications and updates from Enorae
        </ItemDescription>
        <form action={formAction} className="space-y-6" aria-describedby={state.error ? 'form-error' : undefined}>
          {/* Screen reader announcement for form status */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {isPending && 'Form is submitting, please wait'}
            {state.success && 'Preferences saved successfully'}
          </div>

          {/* Hidden inputs to pass preference values */}
          <input type="hidden" name="email_appointments" value={String(preferences.email_appointments)} />
          <input type="hidden" name="email_promotions" value={String(preferences.email_promotions)} />
          <input type="hidden" name="sms_reminders" value={String(preferences.sms_reminders)} />
          <input type="hidden" name="push_enabled" value={String(preferences.push_enabled)} />

          <NotificationSection
            icon={<Mail className="size-4 text-muted-foreground" />}
            title="Email notifications"
          >
            <div className="space-y-4 pl-6">
              <NotificationToggleItem
                id="email_appointments"
                labelId="notification-email-appointments-label"
                title="Appointment updates"
                description="Confirmations, reminders, and cancellations"
                checked={preferences.email_appointments ?? true}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, email_appointments: checked }))
                }
                disabled={isPending}
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
                disabled={isPending}
              />
            </div>
          </NotificationSection>

          <NotificationSection
            icon={<MessageSquare className="size-4 text-muted-foreground" />}
            title="SMS notifications"
          >
            <div className="space-y-4 pl-6">
              <NotificationToggleItem
                id="sms_reminders"
                labelId="notification-sms-reminders-label"
                title="Appointment reminders"
                description="Get SMS reminders before your appointments"
                checked={preferences.sms_reminders ?? true}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, sms_reminders: checked }))
                }
                disabled={isPending}
              />
            </div>
          </NotificationSection>

          <NotificationSection
            icon={<Smartphone className="size-4 text-muted-foreground" />}
            title="Push notifications"
          >
            <div className="space-y-4 pl-6">
              <NotificationToggleItem
                id="push_enabled"
                labelId="notification-push-enabled-label"
                title="Enable push notifications"
                description="Receive real-time updates on your device"
                checked={preferences.push_enabled ?? true}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, push_enabled: checked }))
                }
                disabled={isPending}
              />
            </div>
          </NotificationSection>

          {state.error && (
            <Alert variant="destructive" role="alert" id="form-error">
              <AlertCircle className="size-4" />
              <AlertTitle>Update failed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state.success && (
            <Alert role="status">
              <AlertCircle className="size-4" />
              <AlertTitle>Preferences saved</AlertTitle>
              <AlertDescription>Preferences updated successfully!</AlertDescription>
            </Alert>
          )}

          <SubmitButton disabled={isPending} />
        </form>
      </ItemContent>
    </Item>
  )
}
